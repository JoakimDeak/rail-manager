local apiBase = "http://localhost:3000/api"

local statusRes = http.get(apiBase .. "/status")
if not statusRes then
    error("Could not connect to server")
end
local id = nil
if not fs.exists("./node-id.txt") then
    local nodesRes = textutils.unserialiseJSON(http.get(apiBase .. "/nodes", {
        ["Accept"] = "application/json"
    }).readAll())

    print("Select node")
    print("-----")
    for _, node in pairs(nodesRes.nodes) do
        print(node.name)
    end
    print("-----")
    local nodeName = read()

    for _, node in pairs(nodesRes.nodes) do
        if node.name == nodeName then
            id = node.id
            break
        end
    end

    local idFile = fs.open("./node-id.txt", "w")
    idFile.write(id)
    idFile.close()
else
    local idFile = fs.open("./node-id.txt", "r")
    id = idFile.read()
    idFile.close()
end

local nodeRes = http.get(apiBase .. "/nodes/" .. id)
if not nodeRes then
    print("Node could not be found resetting config")
    fs.delete("./node-id.txt")
    return
end

print("Running client for: " .. id)

local edgesRes = textutils.unserialiseJSON(http.get(apiBase .. "/nodes/" .. id .. "/edges", {
    ["Accept"] = "application/json"
}).readAll())
local numOfEdges = table.getn(edgesRes.edges)

if numOfEdges == 0 then
    print("Node has no edges")
    return
end

if numOfEdges == 1 then
    print("Running as station")
    -- TODO: Add station client and just a node list that does a post request should be enough.
    -- Doubt the latency would be so high you could get to a junction too early
    return
end

print("Running as junction")

local connectedNodes = {}
for i, edge in pairs(edgesRes.edges) do
    local connectedNode = nil
    if edge.nodes[1] == id then
        connectedNode = edge.nodes[2]
    else
        connectedNode = edge.nodes[1]
    end
    connectedNodes[i] = connectedNode
end

if not fs.exists("./route-config.json") then

    local nodesRes = textutils.unserialiseJSON(http.get(apiBase .. "/nodes", {
        ["Accept"] = "application/json"
    }).readAll())

    local config = {}
    local routeConfig = fs.open("./route-config.json", "w")
    for _, a in pairs(connectedNodes) do
        for __, b in pairs(connectedNodes) do
            if not (a == b) then
                local aName = nil
                local bName = nil

                for _, node in pairs(nodesRes.nodes) do
                    if node.id == a then
                        aName = node.name
                    end
                    if node.id == b then
                        bName = node.name
                    end
                end

                print("Enter state (0|1) for " .. aName .. "->" .. bName)
                local state = read()
                config[a .. "," .. b] = state
            end
        end
    end
    routeConfig.write(textutils.serialiseJSON(config))
    routeConfig.close()
end

local routeConfigFile = fs.open("./route-config.json", "r")
local config = textutils.unserialiseJSON(routeConfigFile.readAll())

local ws = http.websocket("ws://localhost:3000?nodeId=" .. id)
if ws then
    print("Connection opened")

    if fs.exists("./state.txt") then
        local savedStateFile = fs.open("./state.txt", "r")
        local savedState = savedStateFile.readAll()
        savedStateFile.close()
        if savedState == "0" then
            redstone.setOutput("back", false)
        elseif savedState == "1" then
            redstone.setOutput("back", true)
        else
            print("Invalid saved state, disregarding")
        end
    end

    while true do
        local message = ws.receive()
        local state = config[message]
        if (state == "0") then
            redstone.setOutput("back", false)
        elseif state == "1" then
            redstone.setOutput("back", true)
        else
            error("Invalid state")
        end
        local saveStateFile = fs.open("./state.txt", "w")
        saveStateFile.write(state)
        saveStateFile.close()
    end
end

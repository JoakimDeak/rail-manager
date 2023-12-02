local ip = ""
local port = ""
local ws = http.websocket(string.format("ws://%s:%s", ip, port))

if ws then
    print("Connection opened")
    while true do
        local message = ws.receive()
        print(message)
    end
end

local ws = http.websocket("ws://localhost:3000")
if ws then
    ws.send("Hello")
    print(ws.receive())
    ws.close()
end

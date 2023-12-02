const server = Bun.serve({
  fetch(req, server) {
    server.upgrade(req)
  },
  websocket: {
    message(ws, message) {
      console.log(`Received ${message}`)
      ws.send(`You said: ${message}`)
    },
    open(ws) {
      console.log('connection opened with')
      setInterval(() => {
        ws.send(`Ping ${Math.random()}`)
      }, 5000)
    },
    close() {
      console.log('connection closed')
    },
  },
})

console.log(`Listening on ${server.hostname}:${server.port}`)

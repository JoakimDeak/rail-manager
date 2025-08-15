import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    id: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});
if(!values.id){
  throw new Error("Missing id")
}

const socket = new WebSocket(`ws://localhost:3000?nodeId=${values.id}`);

socket.addEventListener("message", event => {
  console.log('message', event)
});

socket.addEventListener("open", event => {
  console.log('open', event)
});

socket.addEventListener("close", event => {
  console.log('close', event)
});

socket.addEventListener("error", event => {
  console.log('error', event)
});
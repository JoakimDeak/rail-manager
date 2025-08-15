import { BunRequest } from 'bun'
import { PathMap } from 'server/pathfinding'
import { messageHandler } from 'server/web-sockets'
import z from 'zod'

const bodySchema = z.object({ from: z.string(), to: z.string() })

const handler = async (req: BunRequest, pathMap: PathMap) => {
  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response('Invalid body', { status: 400 })
  }
  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error))
  }

  let path = pathMap[`${data.from},${data.to}`]
  if (!path) {
    path = pathMap[`${data.to},${data.from}`]?.toReversed()
  }
  if (!path) {
    return new Response("Unknown node or path doesn't exist", { status: 400 })
  }

  for (let i = 1; i < path.length - 1; i++) {
    messageHandler.send(path[i], `${path[i - 1]},${path[i + 1]}`)
  }

  return new Response()
}

export default handler

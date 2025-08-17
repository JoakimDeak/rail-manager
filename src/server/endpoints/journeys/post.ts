import { BunRequest } from 'bun'
import { getEdges, getNodes } from 'server/db'
import { getAllPaths } from 'server/pathfinding'
import { messageHandler } from 'server/web-sockets'
import z from 'zod'

// TODO: Use names here instead of IDs
const bodySchema = z.object({ from: z.number(), to: z.number() })

const handler = async (req: BunRequest<'/api/journeys'>) => {
  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response(undefined, { status: 400 })
  }
  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error))
  }

  const nodes = getNodes()
  const edges = getEdges()

  // TODO: Cache this in some way
  const paths = getAllPaths(nodes, edges)

  let path = paths[`${data.from},${data.to}`]
  if (!path) {
    path = paths[`${data.to},${data.from}`]?.toReversed()
  }
  if (!path) {
    return new Response("Unknown node or path doesn't exist", { status: 400 })
  }

  for (let i = 1; i < path.length - 1; i++) {
    messageHandler.send(path[i].toString(), `${path[i - 1]},${path[i + 1]}`)
  }

  return new Response()
}

export default handler

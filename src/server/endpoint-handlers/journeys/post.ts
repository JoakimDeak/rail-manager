import { BunRequest } from 'bun'
import { getNodeByName } from 'server/db'
import { getPath } from 'server/pathfinding'
import { messageHandler } from 'server/web-sockets'
import z from 'zod'

const bodySchema = z.object({ from: z.string(), to: z.string() })

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

  const from = getNodeByName({ name: data.from })
  const to = getNodeByName({ name: data.to })

  if (!from || !to) {
    return new Response(undefined, { status: 500 })
  }

  const path = getPath(from.id, to.id)

  if (!path) {
    return new Response("Unknown node or path doesn't exist", { status: 400 })
  }

  for (let i = 1; i < path.length - 1; i++) {
    messageHandler.send(path[i].toString(), `${path[i - 1]},${path[i + 1]}`)
  }

  return new Response()
}

export default handler

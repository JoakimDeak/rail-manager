import { BunRequest } from 'bun'
import { getNode } from 'server/db'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const id = Number(req.params.node)
  const node = getNode({ id })
  if (!node) {
    return new Response(undefined, { status: 404 })
  }
  return Response.json({ node })
}

export default handler

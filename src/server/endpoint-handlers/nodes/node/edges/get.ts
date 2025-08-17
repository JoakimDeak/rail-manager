import { BunRequest } from 'bun'
import { getNodeEdges } from 'server/db'

const handler = (req: BunRequest<'/api/nodes/:node/edges'>) => {
  const id = Number(req.params.node)

  const edges = getNodeEdges({ id })

  return Response.json({ edges })
}

export default handler

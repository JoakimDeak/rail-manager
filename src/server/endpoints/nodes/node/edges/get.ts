import { BunRequest } from 'bun'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/nodes/:node/edges'>) => {
  const nodeId = req.params.node

  if (!network.nodes.some((node) => node.id === nodeId)) {
    return new Response('Not found', { status: 404 })
  }

  const edges = network.edges.filter((edge) => edge.nodes.includes(nodeId))

  return Response.json({ edges })
}

export default handler

import { BunRequest } from 'bun'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const nodeId = req.params.node
  const node = network.nodes.find((node) => node.id === nodeId)
  if (!node) {
    return new Response('Node not found', { status: 404 })
  }
  return Response.json({ node })
}

export default handler

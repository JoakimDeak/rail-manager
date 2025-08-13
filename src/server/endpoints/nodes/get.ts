import { BunRequest } from 'bun'
import { Network } from 'server/network'

const handler = (_: BunRequest<'/api/nodes'>, network: Network) => {
  return Response.json({ nodes: network.nodes })
}

export default handler

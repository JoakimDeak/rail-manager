import { BunRequest } from 'bun'
import { Network } from 'server/network'

const handler = (_: BunRequest<'/api/edges'>, network: Network) => {
  return Response.json({ edges: network.edges })
}

export default handler

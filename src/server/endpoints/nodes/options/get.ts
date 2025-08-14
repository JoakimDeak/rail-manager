import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { NodeOptions } from 'server/templates/NodeOptions'

const handler = (req: BunRequest<'/api/nodes/options'>, network: Network) => {
  const html = NodeOptions({ nodes: network.nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

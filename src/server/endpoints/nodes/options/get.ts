import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { NodeOptions } from 'server/templates/NodeOptions'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/nodes/options'>) => {
  const html = NodeOptions({ nodes: network.nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

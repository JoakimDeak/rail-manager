import { BunRequest } from 'bun'
import { getNodes } from 'server/db'
import { NodeOptions } from 'server/templates/NodeOptions'

const handler = (_: BunRequest<'/api/nodes/options'>) => {
  const nodes = getNodes()
  const html = NodeOptions({ nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

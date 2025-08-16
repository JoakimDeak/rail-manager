import { BunRequest } from 'bun'
import { NodeList } from 'server/templates/NodeList'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/nodes'>) => {
  req.headers.get('accept')
  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ nodes: network.nodes })
  }

  const html = NodeList({ nodes: network.nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

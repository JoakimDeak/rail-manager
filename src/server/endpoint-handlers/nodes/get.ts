import { BunRequest } from 'bun'
import { getNodesWithEdgeCount } from 'server/db'
import { NodeList } from 'server/templates/NodeList'

const handler = (req: BunRequest<'/api/nodes'>) => {
  req.headers.get('accept')

  const nodes = getNodesWithEdgeCount()

  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ nodes })
  }

  const html = NodeList({ nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

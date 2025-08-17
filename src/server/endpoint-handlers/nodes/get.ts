import { BunRequest } from 'bun'
import { getNodes, getNodesWithEdgeCount } from 'server/db'
import { NodeList } from 'server/templates/NodeList'

const handler = (req: BunRequest<'/api/nodes'>) => {
  req.headers.get('accept')

  if (req.headers.get('Accept') === 'application/json') {
    const nodes = getNodes()
    return Response.json({ nodes })
  }

  const nodes = getNodesWithEdgeCount()

  const html = NodeList({ nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

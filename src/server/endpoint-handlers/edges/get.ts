import { BunRequest } from 'bun'
import { getEdges, getEdgesWithNodeName } from 'server/db'
import { EdgeList } from 'server/templates/EdgeList'

const handler = (req: BunRequest<'/api/edges'>) => {
  req.headers.get('accept')
  if (req.headers.get('Accept') === 'application/json') {
    const edges = getEdges()

    return Response.json({ edges })
  }

  const edges = getEdgesWithNodeName()

  const html = EdgeList({ edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

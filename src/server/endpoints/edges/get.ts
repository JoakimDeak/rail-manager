import { BunRequest } from 'bun'
import { EdgeList } from 'server/templates/EdgeList'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/edges'>) => {
  req.headers.get('accept')
  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ edges: network.edges })
  }

  const html = EdgeList({}).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

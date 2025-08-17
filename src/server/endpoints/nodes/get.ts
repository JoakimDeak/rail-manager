import { BunRequest } from 'bun'
import { NodeList } from 'server/templates/NodeList'
import { db } from 'server'
import { Node } from 'server/network'

const handler = (req: BunRequest<'/api/nodes'>) => {
  req.headers.get('accept')

  const nodes = db.query<Node, never[]>(`SELECT * FROM nodes`).all()

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

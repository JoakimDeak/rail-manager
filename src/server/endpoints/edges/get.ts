import { BunRequest } from 'bun'
import { db } from 'server'
import { Edge, PopulatedEdge } from 'server/network'
import { EdgeList } from 'server/templates/EdgeList'

const handler = (req: BunRequest<'/api/edges'>) => {
  req.headers.get('accept')
  if (req.headers.get('Accept') === 'application/json') {
    const edges = db
      .query<Edge, never[]>(
        `
          SELECT *
          FROM edges
        `,
      )
      .all()

    return Response.json({ edges })
  }

  const edges = db
    .query<PopulatedEdge, never[]>(
      `
        SELECT 
          edges.*,
          node1.name as node1Name,
          node2.name as node2Name
        FROM edges
        LEFT JOIN nodes node1 ON edges.node1 = node1.id
        lEFT JOIN nodes node2 ON edges.node2 = node2.id
      `,
    )
    .all()

  const html = EdgeList({ edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

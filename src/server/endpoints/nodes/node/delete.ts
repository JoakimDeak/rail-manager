import { BunRequest } from 'bun'
import { Edge, PopulatedEdge } from 'server/network'
import { db } from 'server'
import { EdgeList } from 'server/templates/EdgeList'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const nodeId = req.params.node

  try {
    db.run<[string]>(
      `
        DELETE FROM nodes
        WHERE id = ?1
      `,
      [nodeId],
    )
  } catch (e: any) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
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

  const html = EdgeList({ oobSwap: 'outerHTML:#edge-list', edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

import { BunRequest } from 'bun'
import { db } from 'server'
import { Edge } from 'server/network'

const handler = (req: BunRequest<'/api/nodes/:node/edges'>) => {
  const nodeId = req.params.node

  const edges = db
    .query<Edge, [string]>(
      `
      SELECT *
      FROM edges
      WHERE edges.node1 = ?1 OR edges.node2 = ?1
    `,
    )
    .all(nodeId)

  return Response.json({ edges })
}

export default handler

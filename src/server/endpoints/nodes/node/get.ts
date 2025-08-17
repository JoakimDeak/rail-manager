import { BunRequest } from 'bun'
import { db } from 'server'
import { Node } from 'server/network'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const nodeId = Number(req.params.node)
  const node = db
    .query<Node, [number]>(
      `
        SELECT *
        FROM nodes
        WHERE nodes.id = ?1
      `,
    )
    .get(nodeId)
  if (!node) {
    return new Response(undefined, { status: 404 })
  }
  return Response.json({ node })
}

export default handler

import { BunRequest } from 'bun'
import { Node, PopulatedEdge } from 'server/network'
import { db } from 'server'
import { EdgeList } from 'server/templates/EdgeList'
import { Node as NodeTemplate } from 'server/templates/Node'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

const handler = async (req: BunRequest<'/api/nodes/:node'>) => {
  const nodeId = Number(req.params.node)

  let body
  const contentType = req.headers.get('Content-Type')
  if (contentType === 'application/json') {
    try {
      body = await req.json()
    } catch (_) {
      return new Response(undefined, { status: 400 })
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    try {
      body = Object.fromEntries(await req.formData())
    } catch (_) {
      return new Response(undefined, { status: 400 })
    }
  } else {
    return new Response(`Unsupported content type ${contentType}`, {
      status: 415,
    })
  }

  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  try {
    db.run<[number, string]>(
      `
        UPDATE nodes
        SET name = ?2
        WHERE nodes.id = ?1
      `,
      [nodeId, data.name],
    )
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const node = db.query<Node, [number]>(`SELECT * FROM nodes WHERE nodes.id = ?1`).get(nodeId)
  if (!node) {
    return new Response(undefined, { status: 500 })
  }
  const numOfConnectedEdges = Number(
    db.run<[number]>(
      `
      SELECT COUNT(*)
      FROM edges
      WHERE edges.node1 = ?1 OR edges.node2 = ?1
    `,
      [nodeId],
    ).lastInsertRowid,
  )
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

  const html =
    NodeTemplate({ node, numOfConnectedEdges }).toString() +
    EdgeList({ oobSwap: 'outerHTML:#edge-list', edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

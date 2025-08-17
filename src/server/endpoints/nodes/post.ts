import { BunRequest } from 'bun'
import z from 'zod'
import { Node as NodeTemplate } from 'server/templates/Node'
import { NodeOptions } from 'server/templates/NodeOptions'
import { db } from 'server'
import { Edge, Node } from 'server/network'

const bodySchema = z.object({
  name: z.string(),
})

const handler = async (req: BunRequest<'/api/nodes'>) => {
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

  const { error, data } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  let nodeId: number
  try {
    const res = db.run<[string]>(
      `
      INSERT INTO nodes (name)
      VALUES(?1)
    `,
      [data.name],
    )
    nodeId = Number(res.lastInsertRowid)
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new Response(
        JSON.stringify({
          error: 'Node name must be unique',
        }),
        { status: 400 },
      )
    }
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ id: nodeId }, { status: 201 })
  }

  const nodes = db.query<Node, never[]>(`SELECT * FROM nodes`).all()

  const html =
    NodeTemplate({
      node: { id: nodeId, name: data.name },
      numOfConnectedEdges: 0,
    }).toString() +
    NodeOptions({
      nodes,
      oobSwap: 'innerHTML:#from-node-select',
    }).toString() +
    NodeOptions({
      nodes,
      oobSwap: 'innerHTML:#to-node-select',
    }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

import { BunRequest } from 'bun'
import { db } from 'server'
import { PopulatedEdge } from 'server/network'
import { Edge } from 'server/templates/Edge'
import z from 'zod'

const bodySchema = z
  .object({
    from: z.string(),
    to: z.string(),
    weight: z.number().min(1).or(z.string().regex(/^\d+$/).transform(Number)),
  })
  .refine((data) => data.from !== data.to, {
    message: 'A node cannot connect to itself',
  })

const handler = async (req: BunRequest<'/api/edges'>) => {
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

  let id: number
  try {
    const res = db.run<[string, string, number]>(
      `
        INSERT INTO edges (node1,node2,weight)
        VALUES(?1,?2,?3)
      `,
      data.from > data.to ? [data.to, data.from, data.weight] : [data.from, data.to, data.weight],
    )
    id = Number(res.lastInsertRowid)
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 201 })
  }

  // TODO: Move this type of query somewhere we can reuse it easily
  const edge = db
    .query<PopulatedEdge, [number]>(
      `
          SELECT 
            edges.*,
            node1.name as node1Name,
            node2.name as node2Name
          FROM edges
          LEFT JOIN nodes node1 ON edges.node1 = node1.id
          LEFT JOIN nodes node2 ON edges.node2 = node2.id
          WHERE edges.id = ?1
        `,
    )
    .get(id)

  if (!edge) {
    return new Response(undefined, { status: 500 })
  }

  const html = Edge({ edge }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

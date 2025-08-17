import { BunRequest } from 'bun'
import { createEdge, getEdgeWithNodeName, getNodesWithEdgeCount } from 'server/db'
import { Edge } from 'server/templates/Edge'
import { NodeList } from 'server/templates/NodeList'
import z from 'zod'

const bodySchema = z
  .object({
    from: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
    to: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
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
    id = createEdge({ from: data.from, to: data.to, weight: data.weight })
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 201 })
  }

  const edge = getEdgeWithNodeName({ id })

  if (!edge) {
    return new Response(undefined, { status: 500 })
  }
  const nodes = getNodesWithEdgeCount()

  const html =
    Edge({ edge }).toString() + NodeList({ nodes, oobSwap: 'outerHTML:#node-list' }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

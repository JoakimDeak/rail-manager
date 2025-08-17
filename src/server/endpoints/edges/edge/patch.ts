import { BunRequest } from 'bun'
import { getEdgeWithNodeName, updateEdge } from 'server/db'
import { Edge } from 'server/templates/Edge'
import z from 'zod'

const bodySchema = z.object({
  weight: z.number().min(1).or(z.string().regex(/^\d+$/).transform(Number)),
})

const handler = async (req: BunRequest<'/api/edges/:edge'>) => {
  const id = Number(req.params.edge)

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
    return new Response(`Unsupported Content-Type ${contentType}`, {
      status: 415,
    })
  }

  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  try {
    updateEdge({ id, weight: data.weight })
  } catch (_) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const edge = getEdgeWithNodeName({ id })

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

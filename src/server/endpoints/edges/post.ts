import { BunRequest } from 'bun'
import { MAX_EDGES_PER_NODE } from 'server/network'
import { saveNetwork } from 'server/persistance'
import { Edge } from 'server/templates/Edge'
import z from 'zod'
import { network } from 'server/server'

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
      return new Response('Invalid body', { status: 400 })
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    try {
      body = Object.fromEntries(await req.formData())
    } catch (_) {
      return new Response('Invalid body', { status: 400 })
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

  const unknownNode = [data.from, data.to].find((node) =>
    network.nodes.every(({ id }) => node !== id),
  )
  if (unknownNode) {
    return new Response(`Unknown node ${unknownNode}`, { status: 400 })
  }

  const fullNode = [data.from, data.to].find(
    (node) =>
      network.edges.filter((edge) => edge.nodes.includes(node)).length === MAX_EDGES_PER_NODE,
  )
  if (fullNode) {
    return new Response(`Node ${fullNode} is already at capacity`)
  }

  const isDuplicateEdge = network.edges.some(
    (edge) => edge.nodes.includes(data.from) && edge.nodes.includes(data.to),
  )
  if (isDuplicateEdge) {
    return new Response(`An edge between ${data.from} and ${data.to} already exists`, {
      status: 400,
    })
  }

  const newEdge = {
    nodes: [data.from, data.to].sort() as [string, string],
    weight: data.weight,
    id: crypto.randomUUID(),
  }
  network.edges.push(newEdge)
  saveNetwork()

  if (req.headers.get('Accept') === 'application/json') {
    return new Response('Created', { status: 201 })
  }

  const edgeWithNodeNames = {
    ...newEdge,
    nodes: newEdge.nodes.map((node) => network.nodes.find(({ id }) => node === id)!),
  }

  const html = Edge({ edge: edgeWithNodeNames }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

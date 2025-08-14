import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import { Edge } from 'server/templates/Edge'
import z from 'zod'

const bodySchema = z.object({
  weight: z.number().min(1).or(z.string().regex(/^\d+$/).transform(Number)),
})

const handler = async (
  req: BunRequest<'/api/edges/:edge'>,
  network: Network
) => {
  const edgeId = req.params.edge
  if (!network.edges.some((edge) => edge.id === edgeId)) {
    return new Response('Not found', { status: 404 })
  }

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
    return new Response(`Unsupported Content-Type ${contentType}`, {
      status: 415,
    })
  }

  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  const curr = network.edges.find((edge) => edge.id === edgeId)!
  network.edges.splice(
    network.edges.findIndex((edge) => edge.id === edgeId),
    1,
    { ...curr, weight: data.weight }
  )
  saveNetwork(network)

  if (req.headers.get('Accept') === 'application/json') {
    return new Response('Patched', { status: 200 })
  }

  const edgeWithNodeNames = {
    ...curr,
    weight: data.weight,
    nodes: curr.nodes.map(
      (node) => network.nodes.find(({ id }) => node === id)!
    ),
  }

  const html = Edge({ edge: edgeWithNodeNames }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

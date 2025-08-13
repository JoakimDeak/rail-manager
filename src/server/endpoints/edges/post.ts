import { BunRequest } from 'bun'
import { MAX_EDGES_PER_NODE, Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import z from 'zod'

const bodySchema = z
  .object({
    nodes: z.tuple([z.string(), z.string()]),
    weight: z.number().min(1),
  })
  .refine((data) => data.nodes[0] !== data.nodes[1], {
    message: 'A node cannot connect to itself',
  })

const handler = async (req: BunRequest<'/api/edges'>, network: Network) => {
  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response('Invalid body', { status: 400 })
  }
  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  const unknownNode = data.nodes.find((node) =>
    network.nodes.every(({ id }) => node !== id)
  )
  if (unknownNode) {
    return new Response(`Unknown node ${unknownNode}`, { status: 400 })
  }

  const fullNode = data.nodes.find(
    (node) =>
      network.edges.filter((edge) => edge.nodes.includes(node)).length ===
      MAX_EDGES_PER_NODE
  )
  if (fullNode) {
    return new Response(`Node ${fullNode} is already at capacity`)
  }

  network.edges.push({
    nodes: data.nodes.sort(),
    weight: data.weight,
    id: crypto.randomUUID(),
  })
  saveNetwork(network)

  return new Response('Created', { status: 201 })
}

export default handler

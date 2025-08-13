import { BunRequest } from 'bun'
import { saveNetwork } from 'server/persistance'
import { MAX_EDGES_PER_NODE, Network } from 'server/network'
import z from 'zod'

const bodySchema = z
  .object({
    name: z.string(),
    edges: z
      .array(
        z.object({
          node: z.string(),
          weight: z.number(),
        })
      )
      .max(MAX_EDGES_PER_NODE),
  })
  .refine(
    (data) =>
      new Set(data.edges.map(({ node }) => node)).size === data.edges.length,
    {
      message: 'Duplicate edges are not allowed',
    }
  )

const handler = async (req: BunRequest<'/api/nodes'>, network: Network) => {
  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response('Invalid body', { status: 400 })
  }

  const { error, data } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  if (network.nodes.some(({ name }) => data.name === name)) {
    return new Response('Node name is already taken', { status: 400 })
  }

  const edgeWithUnknownNode = data.edges.find(
    ({ node }) => !network.nodes.some(({ id }) => node === id)
  )
  if (edgeWithUnknownNode) {
    return new Response(`Unknown node ${edgeWithUnknownNode.node}`, {
      status: 400,
    })
  }

  const fullNode = data.edges.find((newEdge) => {
    const existingEdges = network.edges.reduce((count, edge) => {
      if (edge.nodes.includes(newEdge.node)) {
        return count + 1
      }
      return count
    }, 0)
    return existingEdges === MAX_EDGES_PER_NODE
  })
  if (fullNode) {
    return new Response(`Node ${fullNode.node} is already at capacity`, {
      status: 400,
    })
  }

  const newNodeId = crypto.randomUUID()
  network.nodes.push({ id: newNodeId, name: data.name })
  const newEdges = data.edges.map(({ weight, node }) => ({
    nodes: [newNodeId, node].sort() as [string, string],
    weight,
    id: crypto.randomUUID(),
  }))
  network.edges.push(...newEdges)

  saveNetwork(network)

  return Response.json({ id: newNodeId }, { status: 201 })
}

export default handler

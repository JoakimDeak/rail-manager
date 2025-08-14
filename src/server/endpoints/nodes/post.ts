import { BunRequest } from 'bun'
import { saveNetwork } from 'server/persistance'
import { MAX_EDGES_PER_NODE, Network } from 'server/network'
import z from 'zod'
import { Node } from 'server/templates/Node'
import { NodeOptions } from 'server/templates/NodeOptions'

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
      .max(MAX_EDGES_PER_NODE)
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.edges) {
        return true
      }
      return (
        new Set(data.edges?.map(({ node }) => node)).size === data.edges?.length
      )
    },
    {
      message: 'Duplicate edges are not allowed',
    }
  )

const handler = async (req: BunRequest<'/api/nodes'>, network: Network) => {
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

  const { error, data } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  if (network.nodes.some(({ name }) => data.name === name)) {
    return new Response('Node name is already taken', { status: 400 })
  }

  if (data.edges) {
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
  }

  const newNodeId = crypto.randomUUID()
  network.nodes.push({ id: newNodeId, name: data.name })
  if (data.edges) {
    const newEdges = data.edges.map(({ weight, node }) => ({
      nodes: [newNodeId, node].sort() as [string, string],
      weight,
      id: crypto.randomUUID(),
    }))
    network.edges.push(...newEdges)
  }

  saveNetwork(network)

  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ id: newNodeId }, { status: 201 })
  }

  const html =
    Node({ node: { id: newNodeId, name: data.name } }).toString() +
    NodeOptions({
      nodes: network.nodes,
      oobSwap: 'innerHTML:#from-node-select',
    }).toString() +
    NodeOptions({
      nodes: network.nodes,
      oobSwap: 'innerHTML:#to-node-select',
    }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

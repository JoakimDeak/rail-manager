import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import z from 'zod'

const handler = (req: BunRequest<'/api/edges/:edge'>, network: Network) => {
  const edgeId = req.params.edge
  if (!network.edges.some((edge) => edge.id === edgeId)) {
    return new Response('Not found', { status: 404 })
  }
  const isolatedNode = network.edges
    .find((edge) => edge.id === edgeId)
    ?.nodes.find(
      (node) =>
        network.edges.filter((edge) => edge.nodes.includes(node)).length === 1
    )
  if (isolatedNode) {
    return new Response(
      `Deleting edge ${edgeId} would isolate node ${isolatedNode}`
    )
  }
  network.edges.splice(
    network.edges.findIndex((edge) => edge.id === edgeId),
    1
  )
  saveNetwork(network)

  return new Response('Delete', { status: 200 })
}

export default handler

import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'

const handler = (req: BunRequest<'/api/nodes/:node'>, network: Network) => {
  const nodeId = req.params.node

  if (!network.nodes.some((node) => node.id === nodeId)) {
    return new Response('Not found', { status: 404 })
  }

  const isolatedNode = network.edges
    .filter((edge) => edge.nodes.includes(nodeId))
    .flatMap((edge) => edge.nodes.filter((node) => node !== nodeId))
    .find(
      (node) =>
        network.edges.filter(
          (edge) => edge.nodes.includes(node) && !edge.nodes.includes(nodeId)
        ).length === 0
    )
  if (isolatedNode) {
    return new Response(
      `Deleting node ${nodeId} would isolate node ${isolatedNode}`
    )
  }

  network.nodes.splice(
    network.nodes.findIndex(({ id }) => nodeId === id),
    1
  )
  network.edges = network.edges.filter((edge) => !edge.nodes.includes(nodeId))

  saveNetwork(network)

  return new Response('Deleted', { status: 200 })
}

export default handler

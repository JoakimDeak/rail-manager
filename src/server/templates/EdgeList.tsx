import { Network } from 'server/network'
import { Edge } from './Edge'

export const EdgeList = ({ network, oobSwap }: { network: Network; oobSwap?: string }) => {
  const edgesWithNodeNames = network.edges.map((edge) => {
    const [a, b] = network.nodes.filter((node) => edge.nodes.includes(node.id))
    return { ...edge, nodes: [a, b] }
  })
  return (
    <ul class="flex min-h-10 flex-col gap-2" hx-swap-oob={oobSwap} id="edge-list">
      {edgesWithNodeNames.map((edge) => (
        <Edge edge={edge} />
      ))}
    </ul>
  )
}

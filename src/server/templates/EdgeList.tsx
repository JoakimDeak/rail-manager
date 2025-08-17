import { Network } from 'server/network'
import { Edge } from './Edge'
import { network } from 'server/server'

export const EdgeList = ({ oobSwap }: { oobSwap?: string }) => {
  const edgesWithNodeNames = network.edges.map((edge) => {
    const [a, b] = network.nodes.filter((node) => edge.nodes.includes(node.id))
    return { ...edge, nodes: [a, b] }
  })
  // TODO: Only do min h if theres at least one edge
  return (
    <ul
      class="no-scrollbar flex min-h-10 flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5"
      hx-swap-oob={oobSwap}
      id="edge-list"
    >
      {edgesWithNodeNames.map((edge) => (
        <Edge edge={edge} />
      ))}
    </ul>
  )
}

import { NodeWithEdgeCount } from 'server/db'
import { Node } from './Node'

export const NodeList = ({ nodes, oobSwap }: { nodes: NodeWithEdgeCount[]; oobSwap?: string }) => {
  // TODO: Only do min h if theres at least one node
  return (
    <ul
      class="no-scrollbar flex min-h-10 flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5"
      hx-swap-oob={oobSwap}
      id="node-list"
    >
      {nodes.map((node) => (
        <Node node={node} />
      ))}
    </ul>
  )
}

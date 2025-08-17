import { NodeWithEdgeCount } from 'server/db'
import cn from 'server/utils/cn'
import { Node } from './Node'

export const NodeList = ({ nodes, oobSwap }: { nodes: NodeWithEdgeCount[]; oobSwap?: string }) => {
  return (
    <ul
      class={cn(
        'no-scrollbar flex flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5',
        nodes.length === 0 && 'min-h-10',
      )}
      hx-swap-oob={oobSwap}
      id="node-list"
    >
      {nodes.map((node) => (
        <Node node={node} />
      ))}
    </ul>
  )
}

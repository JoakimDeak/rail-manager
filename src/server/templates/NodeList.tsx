import { Network } from 'server/network'
import { Node } from './Node'

export const NodeList = ({ nodes }: { nodes: Network['nodes'] }) => {
  return (
    <ul class="no-scrollbar flex min-h-10 flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5">
      {nodes.map((node) => (
        <Node node={node} />
      ))}
    </ul>
  )
}

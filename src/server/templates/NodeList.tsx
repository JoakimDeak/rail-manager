import { Network } from 'server/network'
import { Node } from './Node'

export const NodeList = ({ nodes }: { nodes: Network['nodes'] }) => {
  return (
    <ul class='flex flex-col gap-2 min-h-10'>
      {nodes.map((node) => (
        <Node node={node} />
      ))}
    </ul>
  )
}

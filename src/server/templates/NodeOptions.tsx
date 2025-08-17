import { Node } from 'server/db'

export const NodeOptions = ({ nodes, oobSwap }: { nodes: Node[]; oobSwap?: string }) => {
  return (
    <optgroup hx-swap-oob={oobSwap}>
      {nodes.map((node) => (
        <option value={node.id.toString()}>{node.name}</option>
      ))}
    </optgroup>
  )
}

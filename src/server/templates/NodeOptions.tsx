import { Fragment } from '@kitajs/html/jsx-runtime'

export const NodeOptions = ({ nodes, oobSwap }: { nodes: Network['nodes']; oobSwap?: string }) => {
  return (
    <optgroup hx-swap-oob={oobSwap}>
      {nodes.map((node) => (
        <option value={node.id}>{node.name}</option>
      ))}
    </optgroup>
  )
}

import { EdgeWithNodeName } from 'server/db'
import { Edge } from './Edge'

export const EdgeList = ({ oobSwap, edges }: { edges: EdgeWithNodeName[]; oobSwap?: string }) => {
  // TODO: Only do min h if theres at least one edge
  return (
    <ul
      class="no-scrollbar flex min-h-10 flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5"
      hx-swap-oob={oobSwap}
      id="edge-list"
    >
      {edges.map((edge) => (
        <Edge edge={edge} />
      ))}
    </ul>
  )
}

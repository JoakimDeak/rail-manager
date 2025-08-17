import { EdgeWithNodeName } from 'server/db'
import cn from 'server/utils/cn'
import { Edge } from './Edge'

export const EdgeList = ({ oobSwap, edges }: { edges: EdgeWithNodeName[]; oobSwap?: string }) => {
  return (
    <ul
      class={cn(
        'no-scrollbar flex flex-col gap-2 overflow-y-scroll pt-px pr-0.5 pb-0.5',
        edges.length === 0 && 'min-h-10',
      )}
      hx-swap-oob={oobSwap}
      id="edge-list"
    >
      {edges.map((edge) => (
        <Edge edge={edge} />
      ))}
    </ul>
  )
}

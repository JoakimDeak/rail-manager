import { NodeWithEdgeCount } from 'server/db'
import { ExternalNodeIcon } from './ExternalNodeIcon'
import { InternalNodeIcon } from './InternalNodeIcons'

export const Node = ({ node }: { node: NodeWithEdgeCount }) => {
  return (
    <li class="flex items-start justify-between gap-2 has-checked:last:h-20">
      <span class="leading-10">-</span>
      <div class="group relative flex w-full items-center justify-between gap-4 p-2 shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline has-checked:shadow-[2px_2px_0px] has-checked:outline">
        <span class="w-[20ch] truncate">{node.name}</span>
        <div class="peer flex items-center gap-2 opacity-0 group-hover:opacity-100 has-checked:opacity-100">
          {node.edgeCount > 0 && (
            <span class="material-icons w-fit shadow-black outline-black">
              {node.edgeCount === 1 ? <ExternalNodeIcon /> : <InternalNodeIcon />}
            </span>
          )}
          <label class="flex">
            <input type="checkbox" class="peer sr-only"></input>
            <span class="material-icons w-fit shadow-black outline-black peer-checked:!hidden hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none">
              edit
            </span>
            <span class="material-icons !hidden w-fit shadow-black outline-black peer-checked:!inline hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none">
              close
            </span>
          </label>
          <button
            hx-target="closest li"
            hx-swap="outerHTML"
            hx-delete={`/api/nodes/${node.id}`}
            class="material-icons w-fit shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none"
          >
            delete
          </button>
        </div>
        <form
          class="absolute bottom-0 left-0 z-10 hidden w-full translate-y-full items-center gap-2 bg-white p-2 shadow-[2px_2px_0px] shadow-black outline outline-black peer-has-checked:flex"
          hx-patch={`api/nodes/${node.id}`}
          hx-target="closest li"
          hx-swap="outerHTML"
        >
          <input
            name="name"
            class="w-full outline-none placeholder:text-neutral-400"
            placeholder="name"
          ></input>
          <button class="material-icons shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none">
            check
          </button>
        </form>
      </div>
    </li>
  )
}

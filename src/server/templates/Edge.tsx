import { EdgeWithNodeName } from 'server/db'

export const Edge = ({ edge }: { edge: EdgeWithNodeName }) => {
  return (
    <li class="flex items-start gap-2 has-checked:last:h-20">
      <span class="leading-10">-</span>
      <div class="group relative flex items-center justify-between gap-4 p-2 shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline has-checked:shadow-[2px_2px_0px] has-checked:outline">
        <span class="w-[30ch] truncate">
          [{edge.node1Name} : {edge.node2Name}] w:{edge.weight}
        </span>
        <div class="peer flex items-center gap-2 opacity-0 group-hover:opacity-100 has-checked:opacity-100">
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
            hx-delete={`/api/edges/${edge.id}`}
            class="material-icons w-fit shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none"
          >
            delete
          </button>
        </div>
        <form
          class="absolute bottom-0 left-0 z-10 hidden w-full translate-y-full items-center gap-2 bg-white p-2 shadow-[2px_2px_0px] shadow-black outline outline-black peer-has-checked:flex"
          hx-patch={`/api/edges/${edge.id}`}
          hx-target="closest li"
          hx-swap="outerHTML"
        >
          <input
            name="weight"
            type="number"
            class="w-full outline-none placeholder:text-neutral-400"
            min={1}
            placeholder="weight"
          ></input>
          <button class="material-icons shadow-black outline-black hover:shadow-[2px_2px_0px] hover:outline active:translate-[1px] active:shadow-none">
            check
          </button>
        </form>
      </div>
    </li>
  )
}

import { Network } from 'server/network'

export const Node = ({ node }: { node: Network['nodes'][number] }) => {
  return (
    <li class='flex gap-2 items-center justify-between'>
      <span>-</span>
      <div class='group relative p-2 hover:shadow-[2px_2px_0px] has-checked:shadow-[2px_2px_0px] shadow-black outline-black hover:outline has-checked:outline flex justify-between items-center gap-4'>
        <span class='w-[20ch] truncate'>{node.name}</span>
        <div class='peer opacity-0 group-hover:opacity-100 has-checked:opacity-100 flex items-center gap-2'>
          <label class='flex'>
            <input type='checkbox' class='peer sr-only'></input>
            <span class='material-icons peer-checked:!hidden hover:shadow-[2px_2px_0px] shadow-black outline-black hover:outline w-fit active:shadow-none active:translate-[1px]'>
              edit
            </span>
            <span class='material-icons !hidden peer-checked:!inline hover:shadow-[2px_2px_0px] shadow-black outline-black hover:outline w-fit active:shadow-none active:translate-[1px]'>
              close
            </span>
          </label>
          <button
            hx-target='closest li'
            hx-swap='outerHTML'
            hx-delete={`/api/nodes/${node.id}`}
            class='material-icons hover:shadow-[2px_2px_0px] shadow-black outline-black hover:outline w-fit active:shadow-none active:translate-[1px]'
          >
            delete
          </button>
        </div>
        <form
          class='hidden peer-has-checked:flex z-10 absolute translate-y-full left-0 bottom-0 w-full p-2 bg-white shadow-[2px_2px_0px] shadow-black outline-black outline items-center gap-2'
          hx-patch={`api/nodes/${node.id}`}
          hx-target='closest li'
          hx-swap='outerHTML'
        >
          <input
            name='name'
            class='placeholder:text-neutral-400 w-full outline-none'
            placeholder='name'
          ></input>
          <button class='material-icons hover:shadow-[2px_2px_0px] shadow-black outline-black hover:outline active:shadow-none active:translate-[1px]'>
            check
          </button>
        </form>
      </div>
    </li>
  )
}

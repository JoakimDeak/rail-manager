import { BunRequest } from 'bun'
import { deleteNode, getEdgesWithNodeName } from 'server/db'
import { EdgeList } from 'server/templates/EdgeList'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const id = Number(req.params.node)

  try {
    deleteNode({ id })
  } catch (e: any) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const edges = getEdgesWithNodeName()

  const html = EdgeList({ oobSwap: 'outerHTML:#edge-list', edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

import { BunRequest } from 'bun'
import { saveNetwork } from 'server/persistance'
import { EdgeList } from 'server/templates/EdgeList'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/nodes/:node'>) => {
  const nodeId = req.params.node

  if (!network.nodes.some((node) => node.id === nodeId)) {
    return new Response('Not found', { status: 404 })
  }

  network.nodes.splice(
    network.nodes.findIndex(({ id }) => nodeId === id),
    1,
  )
  network.edges = network.edges.filter((edge) => !edge.nodes.includes(nodeId))

  saveNetwork()

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const html = EdgeList({ oobSwap: 'outerHTML:#edge-list' }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

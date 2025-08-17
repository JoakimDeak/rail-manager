import { BunRequest } from 'bun'
import { deleteEdge, getNodesWithEdgeCount } from 'server/db'
import { NodeList } from 'server/templates/NodeList'

const handler = (req: BunRequest<'/api/edges/:edge'>) => {
  const id = Number(req.params.edge)
  try {
    deleteEdge({ id })
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  const nodes = getNodesWithEdgeCount()
  const html = NodeList({ nodes, oobSwap: 'outerHTML:#node-list' }).toString()

  return new Response(html, { status: 200 })
}

export default handler

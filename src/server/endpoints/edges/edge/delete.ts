import { BunRequest } from 'bun'
import { saveNetwork } from 'server/persistance'
import { network } from 'server/server'

const handler = (req: BunRequest<'/api/edges/:edge'>) => {
  const edgeId = req.params.edge
  if (!network.edges.some((edge) => edge.id === edgeId)) {
    return new Response('Not found', { status: 404 })
  }

  network.edges.splice(
    network.edges.findIndex((edge) => edge.id === edgeId),
    1,
  )
  saveNetwork()

  return new Response(undefined, { status: 200 })
}

export default handler

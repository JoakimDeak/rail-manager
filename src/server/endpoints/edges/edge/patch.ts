import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import z from 'zod'

const bodySchema = z.object({
  weight: z.number().min(1),
})

const handler = async (
  req: BunRequest<'/api/edges/:edge'>,
  network: Network
) => {
  const edgeId = req.params.edge
  if (!network.edges.some((edge) => edge.id === edgeId)) {
    return new Response('Not found', { status: 404 })
  }
  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response('Invalid body', { status: 400 })
  }
  const { data, error } = bodySchema.safeParse(body)
  if (error) {
    return Response.json(z.treeifyError(error))
  }

  const curr = network.edges.find((edge) => edge.id === edgeId)!
  network.edges.splice(
    network.edges.findIndex((edge) => edge.id === edgeId),
    1,
    { ...curr, weight: data.weight }
  )
  saveNetwork(network)

  return new Response('Patched', { status: 200 })
}

export default handler

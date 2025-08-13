import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

const handler = async (
  req: BunRequest<'/api/nodes/:node'>,
  network: Network
) => {
  const nodeId = req.params.node
  if (!network.nodes.some((node) => node.id === nodeId)) {
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
    return Response.json(z.treeifyError(error), { status: 400 })
  }

  if (network.nodes.some((node) => node.name === data.name)) {
    return new Response('Name already taken', { status: 400 })
  }

  const curr = network.nodes.find((node) => node.id === nodeId)!
  network.nodes.splice(
    network.nodes.findIndex((node) => node.id === nodeId),
    1,
    { ...curr, name: data.name }
  )
  saveNetwork(network)

  return new Response('Patched', { status: 200 })
}

export default handler

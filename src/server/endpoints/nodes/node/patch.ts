import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { saveNetwork } from 'server/persistance'
import { EdgeList } from 'server/templates/EdgeList'
import { Node } from 'server/templates/Node'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

const handler = async (req: BunRequest<'/api/nodes/:node'>, network: Network) => {
  const nodeId = req.params.node
  if (!network.nodes.some((node) => node.id === nodeId)) {
    return new Response('Not found', { status: 404 })
  }

  let body
  const contentType = req.headers.get('Content-Type')
  if (contentType === 'application/json') {
    try {
      body = await req.json()
    } catch (_) {
      return new Response('Invalid body', { status: 400 })
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    try {
      body = Object.fromEntries(await req.formData())
    } catch (_) {
      return new Response('Invalid body', { status: 400 })
    }
  } else {
    return new Response(`Unsupported content type ${contentType}`, {
      status: 415,
    })
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
    { ...curr, name: data.name },
  )
  saveNetwork(network)

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const html =
    Node({ node: { ...curr, name: data.name } }).toString() +
    EdgeList({ network, oobSwap: 'outerHTML:#edge-list' }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

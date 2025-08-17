import { BunRequest } from 'bun'
import { getEdgesWithNodeName, getNodeWithEdgeCount, updateNode } from 'server/db'
import { EdgeList } from 'server/templates/EdgeList'
import { Node as NodeTemplate } from 'server/templates/Node'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

const handler = async (req: BunRequest<'/api/nodes/:node'>) => {
  const id = Number(req.params.node)

  let body
  const contentType = req.headers.get('Content-Type')
  if (contentType === 'application/json') {
    try {
      body = await req.json()
    } catch (_) {
      return new Response(undefined, { status: 400 })
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    try {
      body = Object.fromEntries(await req.formData())
    } catch (_) {
      return new Response(undefined, { status: 400 })
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

  try {
    updateNode({ id, name: data.name })
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  if (req.headers.get('Accept') === 'application/json') {
    return new Response(undefined, { status: 200 })
  }

  const node = getNodeWithEdgeCount({ id })
  if (!node) {
    return new Response(undefined, { status: 500 })
  }

  const edges = getEdgesWithNodeName()

  const html =
    NodeTemplate({ node }).toString() +
    EdgeList({ oobSwap: 'outerHTML:#edge-list', edges }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

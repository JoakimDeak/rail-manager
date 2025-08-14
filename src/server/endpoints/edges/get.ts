import { BunRequest } from 'bun'
import { Network } from 'server/network'
import { EdgeList } from 'server/templates/EdgeList'

const handler = (req: BunRequest<'/api/edges'>, network: Network) => {
  req.headers.get('accept')
  if (req.headers.get('Accept') === 'application/json') {
    return Response.json({ edges: network.edges })
  }

  const html = EdgeList({ network }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

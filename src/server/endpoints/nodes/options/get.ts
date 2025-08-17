import { BunRequest } from 'bun'
import { Node } from 'server/network'
import { db } from 'server'
import { NodeOptions } from 'server/templates/NodeOptions'

const handler = (_: BunRequest<'/api/nodes/options'>) => {
  const nodes = db.query<Node, never[]>(`SELECT * FROM nodes`).all()
  const html = NodeOptions({ nodes }).toString()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export default handler

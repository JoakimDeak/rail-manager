import { BunRequest } from 'bun'
import { db } from 'server'

const handler = (req: BunRequest<'/api/edges/:edge'>) => {
  const edgeId = req.params.edge
  try {
    db.run<[string]>(
      `
        DELETE FROM edges
        WHERE edges.id = ?1
      `,
      [edgeId],
    )
  } catch (e) {
    return new Response(undefined, { status: 500 })
  }

  return new Response(undefined, { status: 200 })
}

export default handler

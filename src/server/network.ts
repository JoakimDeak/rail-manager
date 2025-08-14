import z from 'zod'

export const MAX_EDGES_PER_NODE = 3

export const networkSchema = z
  .object({
    nodes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
    edges: z.array(
      z.object({
        nodes: z.tuple([z.string(), z.string()]),
        weight: z.number().min(1),
        id: z.string(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (
      !data.nodes.every(
        (node) =>
          data.edges.filter(({ nodes: [a, b] }) => node.id === a || node.id === b).length <=
          MAX_EDGES_PER_NODE,
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Nodes have a maximum of ${MAX_EDGES_PER_NODE} edges`,
      })
    }
    if (new Set(data.nodes.map(({ name }) => name)).size !== data.nodes.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Node names must be unique',
      })
    }
    if (data.edges.some((edge) => edge.nodes[0] === edge.nodes[1])) {
      ctx.addIssue({
        code: 'custom',
        message: 'A node cannot connect to itself',
      })
    }
    // add edge uniqueness
  })

export type Network = z.infer<typeof networkSchema>

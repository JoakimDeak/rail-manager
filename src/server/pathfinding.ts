import { Edge, Node } from './network'

const getParentGraph = (start: number, nodes: Node[], edges: Edge[]) => {
  const dists = nodes.reduce(
    (acc, curr) => {
      if (curr.id === start) {
        acc[curr.id] = 0
      } else {
        acc[curr.id] = Infinity
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const queue = nodes.slice().map(({ id }) => id)
  const visited = new Set<number>()
  const parents: Partial<Record<number, number>> = {}

  while (queue.length > 0) {
    const curr = queue
      .filter((node) => !visited.has(node))
      .reduce(
        (min, curr) => {
          if (min === undefined || dists[curr] < dists[min]) {
            return curr
          }
          return min
        },
        undefined as number | undefined,
      )
    if (curr === undefined) {
      break
    }

    visited.add(curr)

    const neighbours = edges
      .filter(({ node1, node2 }) => curr === node1 || curr == node2)
      .map(({ node1, node2, weight }) => ({
        node: curr === node1 ? node2 : node1,
        weight,
      }))

    neighbours.forEach((neighbour) => {
      const nextDist = dists[curr] + neighbour.weight
      if (nextDist < dists[neighbour.node]) {
        parents[neighbour.node] = curr
        dists[neighbour.node] = nextDist
      }
    })
  }

  return parents
}

const pathfind = (parentGraph: Partial<Record<number, number>>, end: number) => {
  const path: number[] = [end]
  let prev = parentGraph[end]
  while (prev !== undefined) {
    path.push(prev)
    prev = parentGraph[prev]
  }

  if (path.length === 1) {
    return undefined
  }

  return path.toReversed()
}

export const getAllPaths = (nodes: Node[], edges: Edge[]) => {
  const paths: Partial<Record<`${number},${number}`, number[]>> = {}
  const parentGraphs = nodes.reduce(
    (graphs, node) => {
      graphs[node.id] = getParentGraph(node.id, nodes, edges)
      return graphs
    },
    {} as Record<number, Partial<Record<number, number>>>,
  )

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      paths[`${nodes[i].id},${nodes[j].id}`] = pathfind(parentGraphs[nodes[i].id], nodes[j].id)
    }
  }
  return paths
}

import { Network } from './network'

const getParentGraph = (start: string, network: Network) => {
  const dists = network.nodes.reduce(
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

  const queue = network.nodes.slice().map(({ id }) => id)
  const visited = new Set<string>()
  const parents: Partial<Record<string, string>> = {}

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
        undefined as string | undefined,
      )
    if (curr === undefined) {
      break
    }

    visited.add(curr)

    const neighbours = network.edges
      .filter(({ nodes: [a, b] }) => curr === a || curr === b)
      .map(({ nodes: [a, b], weight }) => ({
        node: curr === a ? b : a,
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

const pathfind = (parentGraph: Partial<Record<string, string>>, end: string) => {
  const path: string[] = [end]
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

export const getAllPaths = (network: Network) => {
  const paths: Partial<Record<`${string},${string}`, string[]>> = {}
  const parentGraphs = network.nodes.reduce(
    (graphs, node) => {
      graphs[node.id] = getParentGraph(node.id, network)
      return graphs
    },
    {} as Record<string, Partial<Record<string, string>>>,
  )

  for (let i = 0; i < network.nodes.length - 1; i++) {
    for (let j = i + 1; j < network.nodes.length; j++) {
      paths[`${network.nodes[i].id},${network.nodes[j].id}`] = pathfind(
        parentGraphs[network.nodes[i].id],
        network.nodes[j].id,
      )
    }
  }
  return paths
}

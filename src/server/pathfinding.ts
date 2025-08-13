const graph = {
  nodes: [
    { id: 'a', name: 'alpha' },
    { id: 'b', name: 'bravo' },
    { id: 'c', name: 'charlie' },
    { id: 'd', name: 'delta' },
    { id: 'e', name: 'echo' },
    { id: 'f', name: 'foxtrot' },
  ],
  edges: [
    { nodes: ['a', 'b'], weight: 1 },
    { nodes: ['b', 'c'], weight: 1 },
    { nodes: ['c', 'd'], weight: 1 },
    { nodes: ['c', 'f'], weight: 1 },
    { nodes: ['d', 'e'], weight: 1 },
    { nodes: ['e', 'f'], weight: 1 },
  ],
}

const getParentGraph = (start: string) => {
  const dists = graph.nodes.reduce((acc, curr) => {
    if (curr.id === start) {
      acc[curr.id] = 0
    } else {
      acc[curr.id] = Infinity
    }
    return acc
  }, {} as Record<string, number>)

  const queue = graph.nodes.slice().map(({ id }) => id)
  const visited = new Set<string>()
  const parents: Partial<Record<string, string>> = {}

  while (queue.length > 0) {
    const curr = queue
      .filter((node) => !visited.has(node))
      .reduce((min, curr) => {
        if (min === undefined || dists[curr] < dists[min]) {
          return curr
        }
        return min
      }, undefined as string | undefined)
    if (curr === undefined) {
      break
    }

    visited.add(curr)

    const neighbours = graph.edges
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

const pathfind = (
  parentGraph: Partial<Record<string, string>>,
  end: string
) => {
  const path: string[] = [end]
  let prev = parentGraph[end]
  while (prev !== undefined) {
    path.push(prev)
    prev = parentGraph[prev]
  }
  return path.toReversed()
}

const getAllPaths = () => {
  const paths: Partial<Record<`${string},${string}`, string[]>> = {}
  const parentGraphs = graph.nodes.reduce((graphs, node) => {
    graphs[node.id] = getParentGraph(node.id)
    return graphs
  }, {} as Record<string, Partial<Record<string, string>>>)
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    for (let j = i + 1; j < graph.nodes.length; j++) {
      paths[`${graph.nodes[i].id},${graph.nodes[j].id}`] = pathfind(
        parentGraphs[graph.nodes[i].id],
        graph.nodes[j].id
      )
    }
  }
  return paths
}

console.log(getAllPaths())

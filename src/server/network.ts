export type Node = {
  id: number
  name: string
}
export type Edge = {
  id: number
  weight: number
  node1: Node['id']
  node2: Node['id']
}
export type PopulatedEdge = Edge & {
  node1Name: Node['name']
  node2Name: Node['name']
}

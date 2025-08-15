import { Network, networkSchema } from '../network'
import { writeFileSync, readFileSync } from 'fs'
import { getAllPaths, pathMapSchema } from '../pathfinding'

export const saveNetwork = async (network: Network) => {
  const paths = getAllPaths(network)
  writeFileSync('src/server/persistance/network.json', JSON.stringify(network))
  writeFileSync('src/server/persistance/paths.json', JSON.stringify(paths))
}

export const getNetwork = () => {
  return networkSchema.parse(
    JSON.parse(readFileSync('src/server/persistance/network.json', 'utf8')),
  )
}

export const getPathMap = () => {
  return pathMapSchema.parse(JSON.parse(readFileSync('src/server/persistance/paths.json', 'utf8')))
}

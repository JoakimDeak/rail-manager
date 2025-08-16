import { Network, networkSchema } from '../network'
import { writeFileSync, readFileSync } from 'fs'
import { getAllPaths, pathMapSchema } from '../pathfinding'
import { network } from 'server/server'

// TODO: Use a db at this point cause this is terrible and pathMap doesn't update without a server restart
export const saveNetwork = async () => {
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

import { Network, networkSchema } from './network'
import { writeFileSync, readFileSync } from 'fs'

export const saveNetwork = (network: Network) => {
  writeFileSync('network.json', JSON.stringify(network))
}

export const getNetwork = () => {
  return networkSchema.parse(JSON.parse(readFileSync('network.json', 'utf8')))
}

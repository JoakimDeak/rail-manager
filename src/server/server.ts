import { BunRequest as _BunRequest } from 'bun'
import nodesPostHandler from './endpoints/nodes/post'
import nodesGetHandler from './endpoints/nodes/get'
import nodesOptionsGetHandler from './endpoints/nodes/options/get'
import nodeDeleteHandler from './endpoints/nodes/node/delete'
import nodePatchHandler from './endpoints/nodes/node/patch'
import edgesGetHandler from './endpoints/edges/get'
import edgesPostHandler from './endpoints/edges/post'
import edgeDeleteHandler from './endpoints/edges/edge/delete'
import edgePatchHandler from './endpoints/edges/edge/patch'
import { getNetwork } from './persistance'
import index from './templates/index.html'

const network = getNetwork()

Bun.serve({
  routes: {
    '/api/nodes': {
      GET: (req) => {
        return nodesGetHandler(req, network)
      },
      POST: (req) => {
        return nodesPostHandler(req, network)
      },
    },
    '/api/nodes/options': {
      GET: (req) => {
        return nodesOptionsGetHandler(req, network)
      },
    },
    '/api/nodes/:node': {
      DELETE: (req) => {
        return nodeDeleteHandler(req, network)
      },
      PATCH: (req) => {
        return nodePatchHandler(req, network)
      },
    },
    '/api/edges': {
      GET: (req) => {
        return edgesGetHandler(req, network)
      },
      POST: (req) => {
        return edgesPostHandler(req, network)
      },
    },
    '/api/edges/:edge': {
      DELETE: (req) => {
        return edgeDeleteHandler(req, network)
      },
      PATCH: (req) => {
        return edgePatchHandler(req, network)
      },
    },
    '/dist/globals.css': new Response(Bun.file('dist/globals.css')),
    '/': index,
  },
  fetch(req, server) {
    server.upgrade(req)
  },
  // figure out how we're using and managing this from lua
  websocket: {
    message(ws, message) {
      console.log(`Received ${message}`)
      ws.send(`You said: ${message}`)
    },
    open(ws) {
      console.log('connection opened with')
      setInterval(() => {
        ws.send(`Ping ${Math.random()}`)
      }, 5000)
    },
    close() {
      console.log('connection closed')
    },
  },
})

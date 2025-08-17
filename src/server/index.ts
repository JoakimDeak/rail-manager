import edgeDeleteHandler from './endpoint-handlers/edges/edge/delete'
import edgePatchHandler from './endpoint-handlers/edges/edge/patch'
import edgesGetHandler from './endpoint-handlers/edges/get'
import edgesPostHandler from './endpoint-handlers/edges/post'
import journeysPostHandler from './endpoint-handlers/journeys/post'
import nodesGetHandler from './endpoint-handlers/nodes/get'
import nodeDeleteHandler from './endpoint-handlers/nodes/node/delete'
import nodeEdgesGetHandler from './endpoint-handlers/nodes/node/edges/get'
import nodeGetHandler from './endpoint-handlers/nodes/node/get'
import nodePatchHandler from './endpoint-handlers/nodes/node/patch'
import nodesOptionsGetHandler from './endpoint-handlers/nodes/options/get'
import nodesPostHandler from './endpoint-handlers/nodes/post'
import index from './templates/index.html'
import handlers from './web-sockets'

const server = Bun.serve({
  routes: {
    '/api/nodes': {
      GET: (req) => {
        return nodesGetHandler(req)
      },
      POST: (req) => {
        return nodesPostHandler(req)
      },
    },
    '/api/nodes/options': {
      GET: (req) => {
        return nodesOptionsGetHandler(req)
      },
    },
    '/api/nodes/:node': {
      DELETE: (req) => {
        return nodeDeleteHandler(req)
      },
      PATCH: (req) => {
        return nodePatchHandler(req)
      },
      GET: (req) => {
        return nodeGetHandler(req)
      },
    },
    '/api/nodes/:node/edges': {
      GET: (req) => {
        return nodeEdgesGetHandler(req)
      },
    },
    '/api/edges': {
      GET: (req) => {
        return edgesGetHandler(req)
      },
      POST: (req) => {
        return edgesPostHandler(req)
      },
    },
    '/api/edges/:edge': {
      DELETE: (req) => {
        return edgeDeleteHandler(req)
      },
      PATCH: (req) => {
        return edgePatchHandler(req)
      },
    },
    '/api/journeys': {
      POST: (req) => {
        return journeysPostHandler(req)
      },
    },
    '/api/status': new Response('OK'),
    '/': index,
  },
  fetch(req, server) {
    const upgradeHeader = req.headers.get('upgrade')
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response(undefined, { status: 404 })
    }

    const nodeId = new URL(req.url).searchParams.get('nodeId')
    if (!nodeId) {
      return new Response(undefined, { status: 400 })
    }

    const wasUpgradeSuccessful = server.upgrade(req, {
      data: { nodeId },
    })
    if (!wasUpgradeSuccessful) {
      return new Response(undefined, { status: 500 })
    }
  },
  websocket: {
    ...handlers,
  },
})

console.log(`Running on ${server.url}`)

import { BunRequest as _BunRequest } from 'bun'
import nodesPostHandler from './endpoints/nodes/post'
import nodesGetHandler from './endpoints/nodes/get'
import nodesOptionsGetHandler from './endpoints/nodes/options/get'
import nodeDeleteHandler from './endpoints/nodes/node/delete'
import nodePatchHandler from './endpoints/nodes/node/patch'
import nodeGetHandler from './endpoints/nodes/node/get'
import nodeEdgesGetHandler from './endpoints/nodes/node/edges/get'
import edgesGetHandler from './endpoints/edges/get'
import edgesPostHandler from './endpoints/edges/post'
import edgeDeleteHandler from './endpoints/edges/edge/delete'
import edgePatchHandler from './endpoints/edges/edge/patch'
import journeysPostHandler from './endpoints/journeys/post'
import index from './templates/index.html'
import handlers from './web-sockets'
import Database from 'bun:sqlite'

const db = new Database('src/server/db.sqlite', { create: true })
db.run(`PRAGMA foreign_keys = ON;`)
db.run(`
  CREATE TABLE IF NOT EXISTS nodes (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
`)
db.run(`
  CREATE TABLE IF NOT EXISTS edges (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    weight  REAL NOT NULL,
    node1   INTEGER NOT NULL,
    node2   INTEGER NOT NULL,
    FOREIGN KEY (node1) REFERENCES Nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (node2) REFERENCES Nodes(id) ON DELETE CASCADE,
    CHECK (node1 < node2),
    UNIQUE (node1, node2)
  );
`)
export { db }

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

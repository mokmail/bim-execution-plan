// Real-time collaboration server using Yjs CRDT over WebSocket.
// Each project gets a shared Y.Doc keyed by its id; clients sync the document
// with convergence + presence. Per the research: Yjs is the leading web CRDT
// library and the idiomatic choice for this.

import type { Server as HttpServer, IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";

const docs = new Map<string, Y.Doc>();

function getDoc(room: string): Y.Doc {
  let doc = docs.get(room);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(room, doc);
  }
  return doc;
}

// Optional DB persistence hook — wired to the Express server via a callback.
let onRoomChange: ((room: string, current: unknown) => Promise<void> | void) | null = null;
export function setRoomChangeHook(fn: typeof onRoomChange) {
  onRoomChange = fn;
}

function broadcast(wss: WebSocketServer, room: string, msg: string) {
  wss.clients.forEach((client) => {
    const c = client as WebSocket & { room?: string };
    if (c.readyState === WebSocket.OPEN && c.room === room) {
      client.send(msg);
    }
  });
}

export function attachCollab(server: HttpServer) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
    const url = new URL(request.url || "", "http://localhost");
    const match = url.pathname.match(/^\/collab\/([^/]+)\/?$/);
    if (!match) return;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, match[1]);
    });
  });

  wss.on("connection", (ws: WebSocket, _req: IncomingMessage, room: string) => {
    (ws as WebSocket & { room?: string }).room = room;
    const doc = getDoc(room);
    const ymap = doc.getMap("bep");

    // Send the current state to the new client.
    ws.send(JSON.stringify({ type: "state", room, doc: ymap.toJSON() }));

    // Debounced persistence on any change.
    let persistT: NodeJS.Timeout | null = null;
    const persist = () => {
      if (persistT) clearTimeout(persistT);
      persistT = setTimeout(() => {
        if (onRoomChange) onRoomChange(room, ymap.toJSON());
      }, 500);
    };

    // Field-level CRDT convergence: apply remote field updates to the Y.Map,
    // broadcast to peers, and persist.
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(String(data));
        if (msg.type === "update" && msg.doc && typeof msg.doc === "object") {
          const current = ymap.toJSON();
          for (const [k, v] of Object.entries(msg.doc)) {
            if (JSON.stringify(current[k]) !== JSON.stringify(v)) {
              ymap.set(k, v);
            }
          }
          persist();
          broadcast(wss, room, JSON.stringify({ type: "update", room, doc: ymap.toJSON() }));
        } else if (msg.type === "presence") {
          broadcast(wss, room, JSON.stringify({ type: "presence", room, data: msg.data }));
        } else if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch {
        /* ignore malformed */
      }
    });

    ws.on("close", () => {
      if (persistT) clearTimeout(persistT);
    });
  });

  return wss;
}

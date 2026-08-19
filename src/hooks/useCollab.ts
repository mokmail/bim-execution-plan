import { useEffect, useRef, useState } from "react";
import type { BepDocument } from "../types/bep";

/**
 * Real-time collaboration hook. Connects to the y-websocket collab server for a
 * project room, syncs the BepDocument field-by-field (last-write-wins CRDT), and
 * exposes presence (who is editing). Returns the merged doc + connection state.
 */
export function useCollab(
  projectId: string | null,
  doc: BepDocument | null,
): {
  peerDoc: BepDocument | null;
  presence: Record<string, string>;
  connected: boolean;
  sendUpdate: (d: BepDocument) => void;
} {
  const [peerDoc, setPeerDoc] = useState<BepDocument | null>(null);
  const [presence, setPresence] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const docRef = useRef<BepDocument | null>(doc);
  docRef.current = doc;

  const sendUpdate = (d: BepDocument) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update", doc: d }));
    }
  };

  useEffect(() => {
    if (!projectId) return;
    const ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/collab/${projectId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "presence", data: { id: localStorage.getItem("bep.author") || "editor" } }));
    };
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "state" || msg.type === "update") {
          setPeerDoc((prev) => {
            const base = prev ?? docRef.current;
            if (!base || !msg.doc) return base;
            const next = { ...base };
            for (const [k, v] of Object.entries(msg.doc)) {
              (next as any)[k] = v;
            }
            return next;
          });
        } else if (msg.type === "presence" && msg.data) {
          setPresence((prev) => ({ ...prev, [msg.data.id]: msg.data.id }));
        }
      } catch {
        /* ignore */
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [projectId]);

  return { peerDoc, presence, connected, sendUpdate };
}

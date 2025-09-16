import type { ServerMatchEvent } from "@repo/shared-types";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../data/client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function subscribeToMatch(
  matchId: string,
  onEvent: (e: ServerMatchEvent) => void
) {
  const s = getSocket();
  s.emit("join-match", matchId);

  const handler = (event: ServerMatchEvent) => {
    onEvent(event);
  };

  s.on("simulation-event", handler);

  return () => {
    s.off("simulation-event", handler);
    s.emit("leave-match", matchId);
  };
}

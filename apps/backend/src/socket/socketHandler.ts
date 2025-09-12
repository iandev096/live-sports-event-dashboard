import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Join match room for live updates
    socket.on("join-match", (matchId: string) => {
      socket.join(`match-${matchId}`);
      console.log(`User ${socket.id} joined match ${matchId}`);
    });

    // Leave match room
    socket.on("leave-match", (matchId: string) => {
      socket.leave(`match-${matchId}`);
      console.log(`User ${socket.id} left match ${matchId}`);
    });
  });
};

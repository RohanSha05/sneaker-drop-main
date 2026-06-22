import { Server } from 'socket.io';
import config from '../config/index.js';

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrls,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
      console.log("Client connected:", socket.id);

			socket.on("join-drop", (dropId) => {
				console.log(`${socket.id} joined ${dropId}`);
				socket.join(`drop-${dropId}`);
			});
  });

  return io;
};

const emitDropUpdate = (dropId, eventName, payload) => {
  if (!io) {
    return;
  }

  io.to(`drop-${dropId}`).emit(eventName, payload);
};

export { emitDropUpdate };
export default initSocket;

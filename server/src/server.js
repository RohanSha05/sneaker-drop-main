import http from 'http';
import 'dotenv/config';
import app from './app.js';
import prisma from './shared/prisma.js';
import config from './config/index.js';
import initSocket from './socket/index.js';
import reservationExpiryJob from './jobs/reservationExpiry.job.js';

let activeServer;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    let currentPort = Number(config.port) || 5000;

    const createAndListen = (port) => {
      activeServer = http.createServer(app);
      initSocket(activeServer);

      activeServer.on('error', async (error) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, retrying on ${port + 1}...`);
          activeServer.close();
          createAndListen(port + 1);
          return;
        }

        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
      });

      activeServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    };

    createAndListen(currentPort);
    reservationExpiryJob();
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async () => {
  await prisma.$disconnect();
  if (activeServer) {
    activeServer.close(() => process.exit(0));
    return;
  }

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', async (error) => {
  console.error('Unhandled rejection detected:', error);
  await shutdown();
});

startServer();

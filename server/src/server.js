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

    const currentPort = Number(config.port) || 5000;
    activeServer = http.createServer(app);
    initSocket(activeServer);

    activeServer.on('error', async (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${currentPort} is busy. Set PORT in server/.env and VITE_API_URL in client/.env to the same API origin.`
        );
      } else {
        console.error(error);
      }

      await prisma.$disconnect();
      process.exit(1);
    });

    activeServer.listen(currentPort, () => {
      console.log(`Server running on port ${currentPort}`);
    });
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

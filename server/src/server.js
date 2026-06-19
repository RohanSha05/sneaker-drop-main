import http from 'http';
import 'dotenv/config';
import app from './app.js';
import prisma from './shared/prisma.js';
import config from './config/index.js';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    let currentPort = Number(config.port) || 5000;

    const createAndListen = (port) => {
      const server = http.createServer(app);

      server.on('error', async (error) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, retrying on ${port + 1}...`);
          server.close();
          createAndListen(port + 1);
          return;
        }

        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
      });

      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      return server;
    };

    createAndListen(currentPort);
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', async (error) => {
  console.error('Unhandled rejection detected:', error);
  await shutdown();
});

startServer();

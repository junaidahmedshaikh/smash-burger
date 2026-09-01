import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`
  🍔 ==========================================
  🚀 SMASH'D Craft Burger Co. API Live!
  📡 Port: ${config.port}
  🌐 Environment: ${config.env}
  ⚡ Health Check: http://localhost:${config.port}/api/v1/health
  ==========================================
      `);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal Server Error during startup:', error);
    process.exit(1);
  }
};

startServer();

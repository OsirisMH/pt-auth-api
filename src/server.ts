import express, { Router } from 'express';
import http from 'http';
import cors from 'cors';
import { ensureInternal } from './adapters/inbound/http/middlewares/ensure-internal';

type Options = {
  port?: number;
  routes: Router;
  onShutdown: () => Promise<void>;
};

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private httpServer?: http.Server;
  private readonly onShutdown: () => Promise<void>;

  constructor(options: Options) {
    const { port = 3100, routes, onShutdown } = options;

    this.port = port;
    this.routes = routes;
    this.onShutdown = onShutdown;
  }

  start() {
    this.app.use(cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Time-Zone'],
      exposedHeaders: [
        'Content-Disposition',
        'Content-Length',
        'Content-Transfer-Encoding',
      ],
    }))

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    this.app.use(ensureInternal),

    this.app.use('/api/v1', this.routes);

    this.httpServer = http.createServer(this.app);

    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

    this.setShutdown();
  }

  private setShutdown() {
    const shutdown = async () => {
      console.log('Shutting down...');

      this.httpServer?.close(async () => {
        try {
          if (this.onShutdown) await this.onShutdown();
        } finally {
          process.exit(0);
        }
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

  getHttpServer(): http.Server {
    if (!this.httpServer) throw new Error('Http server is not ready');
    return this.httpServer;
  }
}
import express, { Request, Response } from 'express';

interface ServerConfig {
  readonly port: string;
}

class ExpressServer {
  private readonly app: express.Application;
  private readonly config: ServerConfig;

  constructor() {
    this.app = express();
    this.config = this.loadConfig();
    this.setupRoutes();
  }

  private loadConfig(): ServerConfig {
    const port = process.env.PORT;
    
    if (!port) {
      throw new Error('PORT is not set in the environment variables');
    }

    return { port };
  }

  private setupRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World');
    });
  }

  public start(): void {
    this.app.listen(this.config.port, () => {
      console.log(`Server is running on http://localhost:${this.config.port}`);
    });
  }
}

// Create and start the server
const server = new ExpressServer();
server.start();

// Export for potential testing or external use
export { ExpressServer };

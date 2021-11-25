import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { RequestHandler } from 'express';
import { WebpackOutput, listFiles } from './dev-toolkit';

process.env = {
  HOST: 'localhost',
  PORT: '3000',
  ...process.env,
};

async function bootstrap() {

  const { browserConfig, serverConfig } = await import('./webpack.config');
  const compiler = webpack(browserConfig);

  let chunks: string[] = null;
  compiler.hooks.afterEmit.tap('SSR', () => {
    if (chunks !== null) return;
    chunks = listFiles(compiler)
      .filter(filename => path.extname(filename) === '.js')
      .reverse();
  });

  const ssr = new WebpackOutput(serverConfig);

  const ssrMiddleware: RequestHandler = async (req, res, next) => {
    if (req.url === '/index.html') {
      try {
        const html = ssr.main?.prerender?.(chunks, req.originalUrl);
        res.send(html);
      } catch (err) {
        return next(err);
      }
    }
    next();
  };

  const { HOST: host, PORT: port } = process.env;
  const devServerOptions: WebpackDevServer.Configuration = {
    host, port,
    historyApiFallback: true,
    client: {
      progress: true,
    },
    hot: true,
    onAfterSetupMiddleware: ({ app }) => {
      app.use(ssrMiddleware);
    }
  };

  const server = new WebpackDevServer(devServerOptions, compiler);
  await server.start();
};

bootstrap();

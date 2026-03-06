import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createGzip } from 'node:zlib';
import { SitemapStream } from 'sitemap';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.get("/robot.txt", (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /')
});

app.get("/sitemap.xml", (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  try {
    const smStream = new SitemapStream({ hostname: 'https://itimenu.app/' })
    const pipeline = smStream.pipe(createGzip())

    smStream.write({ url: '/', changefreq: 'yearly', priority: 0.1 })

    smStream.end()
    pipeline.pipe(res).on('error', (e) => { throw e })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
});

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

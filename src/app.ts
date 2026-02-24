// app.ts
import { buildContainer } from "./composition/buildContainer";
import { buildRoutes } from "./adapters/inbound/http/routes";
import { Server } from "./server";
import { env } from "./config/env";

(() => {
  main();
})();

async function main() {
  const { ctx, auth } = await buildContainer();

  const server = new Server({
    port: ctx.port,
    routes: buildRoutes(auth.controller),
    onShutdown: ctx.onShutdown,
  });

  server.start();
}
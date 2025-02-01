import { PluginOption, ViteDevServer } from "vite";
import { IncomingMessage, ServerResponse } from "http";
import { writeFileSync } from "node:fs";
import { build } from "esbuild";

export type MockApiHandlerRequest = IncomingMessage & {
  params?: { [key: string]: string };
  query?: { [key: string]: string };
  body?: any;
};

export type MockApiHandlerResponse = ServerResponse<IncomingMessage> & {
  json: (data: { [key: string]: any }) => void;
};

export type MockHandler = {
  path: string;
  handler: (req: MockApiHandlerRequest, res: MockApiHandlerResponse) => void;
};

const getMergedHandlerRequest = (req: MockApiHandlerRequest) => {
  const { body } = req;
  const originUrl = (req.headers.origin || "http://localhost:5173") + req.url;
  const search = new URL(originUrl).search || "";

  const searchParams = new URLSearchParams(search);
  const paramKeys = Array.from(searchParams.keys());

  const handlerParams: { [key: string]: string } = {};
  if (paramKeys.length) {
    for (const key of paramKeys) {
      const paramValue = searchParams.get(key);
      if (paramValue) {
        handlerParams[key] = paramValue;
      }
    }
  }

  const mergedRequest = {
    ...req,
    headers: req.headers,
    query: handlerParams,
    params: handlerParams,
    body,
  } as MockApiHandlerRequest;

  return mergedRequest;
};

const getMergedHandlerResponse = (res: ServerResponse<IncomingMessage>) => {
  const mergedResponse = {
    ...res,
    json: (data) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    },
  } as MockApiHandlerResponse;
  return mergedResponse;
};

const setMockHandlers = async (server: ViteDevServer) => {
  try {
    const mockDir = `${server.config.root + "/mock-api"}`;
    const result = await build({
      entryPoints: [`${mockDir}/index.ts`],
      write: false,
      platform: "node",
      bundle: true,
      format: "cjs",
      metafile: true,
      target: "es2015",
    });
    const { text } = result.outputFiles[0];
    writeFileSync(`${mockDir}/index.cjs`, text);

    const handlersModule = (await import(
      `${server.config.root + "/mock-api/index.cjs"}`
    )) as {
      default: MockHandler[] | { default: MockHandler[] };
    };

    let handlers = handlersModule.default;
    if ("default" in handlers) {
      handlers = handlers.default;
    }

    for (const { path: apiPath, handler: apiHandler } of handlers) {
      server.middlewares.use(apiPath, (req, res) => {
        const [handlerReq, handlerRes] = [
          getMergedHandlerRequest(req),
          getMergedHandlerResponse(res),
        ];

        return apiHandler(handlerReq, handlerRes);
      });
    }
  } catch (err) {
    console.error(`Cannot set mock handlers from "/mock-api" index file`);
    console.error(err);
  }
};

const mockApiPlugin = (): PluginOption => {
  return {
    name: "vite-mock-api",
    apply: (config) => {
      return config.mode === "development";
    },
    configureServer: async (server: ViteDevServer) => {
      try {
        await setMockHandlers(server);
      } catch (err) {
        console.error(err);
      }
    },
  };
};
export default mockApiPlugin;

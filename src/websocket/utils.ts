import { Application, Context } from "egg";
import Router = require("koa-router");
import * as WebSocket from "ws";
import { KoaMiddleware } from "midway";
const compose = require('koa-compose');
const co = require('co');


const wsSymbol = Symbol.for('EGG-WS#MIDDLEWARE');
const pathToRegexp = require('path-to-regexp')

function decode(val: any) {
  if (val) return decodeURIComponent(val);
}


function wrapMiddleWares(middleware: KoaMiddleware[]): KoaMiddleware {
  return co.wrap(compose(middleware));
}


function registRouter<StateT, CustomT>(
  path: string,
  router: KoaMiddleware,
  opts?: any
) {
  const pathRegexp = pathToRegexp(path, opts);
  // debug('%s %s -> %s', method || 'ALL', path, re);

  const createRoute = function createRoute(
    routeFunc: KoaMiddleware
  ) {
    return function (ctx: Context, next: any) {
      // path
      const m = pathRegexp.exec(ctx.path);
      // miss
      if (!m) return next();

      const args = m.slice(1).map(decode);
      ctx.routePath = path;
      let params: any = {};
      pathRegexp.keys.forEach((key, index) => {
        if (args[index]) {
          params[key.name] = args[index];
        }
      })
      ctx.params = params;
      // debug('%s %s matches %s %j', ctx.method, path, ctx.path, args);
      args.unshift(ctx);
      args.push(next);
      ctx.wsMatched = true;
      return Promise.resolve(routeFunc.apply(ctx, args));

    }
  };

  if (router) {
    return createRoute(router);
  } else {
    return createRoute;
  }
}


export function registRouterToAoo<StateT, CustomT>(
  app: Application,
  routePath: string,
  router: KoaMiddleware,
  ...middlewares: KoaMiddleware[]
) {
  let wsMiddleWares: KoaMiddleware[] = (app as any)[wsSymbol];
  if (!wsMiddleWares) {
    (app as any)[wsSymbol] = [];
    wsMiddleWares = (app as any)[wsSymbol];
  }
  let middleware = registRouter(routePath, wrapMiddleWares([...middlewares, router]));
  wsMiddleWares.push(middleware);
}


export function pipeWebSocket(source: WebSocket, target: WebSocket) {
  source.on('message', (data) => {
    target.send(data)
  });
  source.once('close', () => {
    target.close();
  });
  target.on('message', (data) => {
    source.send(data)
  });
  target.once('close', () => {
    source.close();
  });
}



export type WsRouter = <StateT, CustomT>(route: any,
  ...middlewares: Router.IMiddleware<StateT, CustomT>[]
) => void;


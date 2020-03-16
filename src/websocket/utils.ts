import { Application, Context } from "egg";
import Router = require("koa-router");
import * as WebSocket from "ws";

const wsSymbol = Symbol.for('EGG-WS#MIDDLEWARE');
const pathToRegexp = require('path-to-regexp')

function decode(val: any) {
  if (val) return decodeURIComponent(val);
}

const router = function <StateT, CustomT>(
  path: string,
  fn: Router.IMiddleware<StateT, CustomT>[],
  opts?: any
) {
  const re = pathToRegexp(path, opts);
  // debug('%s %s -> %s', method || 'ALL', path, re);

  const createRoute = function (routeFunc: any) {
    return function (ctx: Context, next: any) {
      // method
      // if (!matches(ctx)) return next();

      // path
      const m = re.exec(ctx.path);
      if (m) {
        const args = m.slice(1).map(decode);
        ctx.routePath = path;
        let params: any = {};
        re.keys.forEach((key, index) => {
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

      // miss
      return next();
    }
  };

  if (fn) {
    return createRoute(fn);
  } else {
    return createRoute;
  }
}

export type WsRouter = <StateT, CustomT>(route: any,
  ...middlewares: Router.IMiddleware<StateT, CustomT>[]
) => void;
// Array<Router.IMiddleware<StateT, CustomT>>
export function wssOnApplication<StateT, CustomT>(
  app: Application, route: any,
  ...middlewares: Router.IMiddleware<StateT, CustomT>[]
) {
  if (!(app as any)[wsSymbol]) {
    (app as any)[wsSymbol] = [];
  }
  // @ts-ignore
  let m = router(route, ...middlewares);
  (app as any)[wsSymbol].push(m);
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

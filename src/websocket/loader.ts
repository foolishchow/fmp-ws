import { Application, getClassMetadata, getPropertyDataFromClass, getProviderId, listModule, Middleware, RouterOption, RouterParamValue, WEB_ROUTER_KEY, WEB_ROUTER_PARAM_KEY, MiddlewareParamArray, WebMiddleware, KoaMiddleware } from "midway";
import { WebSocketsOption, WEBSOCKETS_KEY } from "./decorators";
import { registRouterToAoo } from "./utils";


export class WebSocketLoader {

  constructor(private app: Application) {

  }

  load() {
    const controllerModules = listModule(WEBSOCKETS_KEY);
    for (const module of controllerModules) {
      const providerId = getProviderId(module);
      if (providerId) {
        this.preRegisterRouter(module, providerId);
      }
    }
  }

  private handlerWebMiddleware(
    middlewares: MiddlewareParamArray | void,
    handlerCallback: (middlewareImpl: Middleware) => void,
  ): void {

    if (middlewares && middlewares.length) {
      for (const middleware of middlewares) {
        if (typeof middleware === 'function') {
          // web function middleware
          handlerCallback(middleware);
        } else {
          const middlewareImpl: WebMiddleware = this.app.middleware
            .filter(m => middleware == m._name)[0];
          // const middlewareImpl: WebMiddleware | void = this.app.middlewares[middleware];
          if (middlewareImpl && typeof middlewareImpl === 'function') {
            handlerCallback(middlewareImpl);
          }
        }
      }
    }
  }

  async preRegisterRouter(module: any, providerId: string) {
    const controllerOption: WebSocketsOption = getClassMetadata(WEBSOCKETS_KEY, module);
    const webRouterInfo: RouterOption[] = getClassMetadata(WEB_ROUTER_KEY, module);

    const middlewares: MiddlewareParamArray = controllerOption.routerOptions.middleware || [];
    if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
      for (const webRouter of webRouterInfo) {
        const routeArgsInfo = getPropertyDataFromClass(WEB_ROUTER_PARAM_KEY, module, webRouter.method) || [];
        const middlewares2: MiddlewareParamArray | void = webRouter.middleware;
        let websocket = await this.generateController(`${providerId}.${webRouter.method}`, routeArgsInfo);
        const currentMiddleWares: KoaMiddleware[] = [];
        this.handlerWebMiddleware(middlewares, imp => currentMiddleWares.push(imp));
        this.handlerWebMiddleware(middlewares2, imp => currentMiddleWares.push(imp));
        registRouterToAoo(
          this.app as any,
          `${controllerOption.prefix}${webRouter.path}`,
          websocket,
          ...currentMiddleWares
        );
      }
    }
  }


  async generateController(
    controllerMapping: string,
    routeArgsInfo: RouterParamValue[]
  ): Promise<Middleware> {
    const [controllerId, methodName] = controllerMapping.split('.');
    return async (ctx, next) => {
      const args = [ctx, next];
      if (Array.isArray(routeArgsInfo)) {
        await Promise.all(routeArgsInfo.map(async ({ index, extractValue }) => {
          args[index] = await extractValue(ctx, next);
        }));
      }
      const controller = await ctx.requestContext.getAsync(controllerId);
      return controller[methodName].apply(controller, args);
    };
  }
}
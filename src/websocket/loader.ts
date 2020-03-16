import { Application, getClassMetadata, getPropertyDataFromClass, getProviderId, listModule, Middleware, RouterOption, RouterParamValue, WEB_ROUTER_KEY, WEB_ROUTER_PARAM_KEY } from "midway";
import { WebSocketsOption, WEBSOCKETS_KEY } from "./decorators";
import { wssOnApplication } from "./utils";


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


  preRegisterRouter(module: any, providerId: string) {
    const controllerOption: WebSocketsOption = getClassMetadata(WEBSOCKETS_KEY, module);
    const webRouterInfo: RouterOption[] = getClassMetadata(WEB_ROUTER_KEY, module);
    if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
      for (const webRouter of webRouterInfo) {
        const routeArgsInfo = getPropertyDataFromClass(WEB_ROUTER_PARAM_KEY, module, webRouter.method) || [];
        let websocket = this.generateController(`${providerId}.${webRouter.method}`, routeArgsInfo)
        wssOnApplication(this.app as any, `${controllerOption.prefix}${webRouter.path}`, websocket)
      }
    }
  }


  generateController(controllerMapping: string, routeArgsInfo?: RouterParamValue[]): Middleware {
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
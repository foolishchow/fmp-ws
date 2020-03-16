"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const decorators_1 = require("./decorators");
const utils_1 = require("./utils");
class WebSocketLoader {
    constructor(app) {
        this.app = app;
    }
    load() {
        const controllerModules = midway_1.listModule(decorators_1.WEBSOCKETS_KEY);
        for (const module of controllerModules) {
            const providerId = midway_1.getProviderId(module);
            if (providerId) {
                this.preRegisterRouter(module, providerId);
            }
        }
    }
    preRegisterRouter(module, providerId) {
        const controllerOption = midway_1.getClassMetadata(decorators_1.WEBSOCKETS_KEY, module);
        const webRouterInfo = midway_1.getClassMetadata(midway_1.WEB_ROUTER_KEY, module);
        if (webRouterInfo && typeof webRouterInfo[Symbol.iterator] === 'function') {
            for (const webRouter of webRouterInfo) {
                const routeArgsInfo = midway_1.getPropertyDataFromClass(midway_1.WEB_ROUTER_PARAM_KEY, module, webRouter.method) || [];
                let websocket = this.generateController(`${providerId}.${webRouter.method}`, routeArgsInfo);
                utils_1.wssOnApplication(this.app, `${controllerOption.prefix}${webRouter.path}`, websocket);
            }
        }
    }
    generateController(controllerMapping, routeArgsInfo) {
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
exports.WebSocketLoader = WebSocketLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dlYnNvY2tldC9sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBOEw7QUFDOUwsNkNBQWdFO0FBQ2hFLG1DQUEyQztBQUczQyxNQUFhLGVBQWU7SUFFMUIsWUFBb0IsR0FBZ0I7UUFBaEIsUUFBRyxHQUFILEdBQUcsQ0FBYTtJQUVwQyxDQUFDO0lBRUQsSUFBSTtRQUNGLE1BQU0saUJBQWlCLEdBQUcsbUJBQVUsQ0FBQywyQkFBYyxDQUFDLENBQUM7UUFDckQsS0FBSyxNQUFNLE1BQU0sSUFBSSxpQkFBaUIsRUFBRTtZQUN0QyxNQUFNLFVBQVUsR0FBRyxzQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLElBQUksVUFBVSxFQUFFO2dCQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDNUM7U0FDRjtJQUNILENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxNQUFXLEVBQUUsVUFBa0I7UUFDL0MsTUFBTSxnQkFBZ0IsR0FBcUIseUJBQWdCLENBQUMsMkJBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRixNQUFNLGFBQWEsR0FBbUIseUJBQWdCLENBQUMsdUJBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRSxJQUFJLGFBQWEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQ3pFLEtBQUssTUFBTSxTQUFTLElBQUksYUFBYSxFQUFFO2dCQUNyQyxNQUFNLGFBQWEsR0FBRyxpQ0FBd0IsQ0FBQyw2QkFBb0IsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckcsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsVUFBVSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDM0Ysd0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQVUsRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUE7YUFDNUY7U0FDRjtJQUNILENBQUM7SUFHRCxrQkFBa0IsQ0FBQyxpQkFBeUIsRUFBRSxhQUFrQztRQUM5RSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRSxPQUFPLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDekIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNoQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtvQkFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNMO1lBQ0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRSxPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTNDRCwwQ0EyQ0MifQ==
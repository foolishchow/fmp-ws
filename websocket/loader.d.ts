import { Application, Middleware, RouterParamValue } from "midway";
export declare class WebSocketLoader {
    private app;
    constructor(app: Application);
    load(): void;
    preRegisterRouter(module: any, providerId: string): void;
    generateController(controllerMapping: string, routeArgsInfo?: RouterParamValue[]): Middleware;
}

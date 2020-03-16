import { Application } from "egg";
import Router = require("koa-router");
import * as WebSocket from "ws";
export declare type WsRouter = <StateT, CustomT>(route: any, ...middlewares: Router.IMiddleware<StateT, CustomT>[]) => void;
export declare function wssOnApplication<StateT, CustomT>(app: Application, route: any, ...middlewares: Router.IMiddleware<StateT, CustomT>[]): void;
export declare function pipeWebSocket(source: WebSocket, target: WebSocket): void;

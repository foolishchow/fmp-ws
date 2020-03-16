import { Server as WebSocketServer } from "ws";
import { Application } from "egg";
import { WebSocketLoader } from "./loader";
export declare class WebSocketIniter {
    private app;
    webSocketLoader: WebSocketLoader;
    webSocketServer: WebSocketServer;
    constructor(app: Application);
    private handlerUpgradeConnection;
    close(): void;
}

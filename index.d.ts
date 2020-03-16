import * as WebSocket from "ws";
export { WebSocket };
export * from "./websocket/decorators";
declare module "egg" {
    interface Context {
        webSocket: WebSocket;
    }
}

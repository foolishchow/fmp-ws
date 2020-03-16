import * as WebSocket from "ws";

export { WebSocket };
export * from "./websocket/decorators"

declare module "egg" {

  export interface Context {
    webSocket: WebSocket
  }
}
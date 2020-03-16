# fmp-ws

> midway playground for websoket dependency on ws

# enable in config
```typescript
import { EggPlugin } from 'midway';
export default {
  static: true, // default is true
  fmpws: {
    enable: true,
    package: "fmp-ws"
  }
} as EggPlugin;
```

# use an websocket class
```typescript
import { Context, inject, provide, query } from "midway";
import { websockets, websocket, WebSocket } from "fmp-ws";

interface WebsocketQuery {
  name: string,
  id: string
}

@provide()
@websockets("/prefix")
export class WsSocketsController {

  @inject() ctx: Context;

  @websocket("/exec")
  async exec(@query() data: WebsocketQuery) {
    let ws: WebSocket = this.ctx.webSocket;
    //...
  }


  @websocket("/attach")
  async attach(@query() data: WebsocketQuery) {
    let ws: WebSocket = this.ctx.webSocket;
    // ...

  }


}
```
import { Server as WebSocketServer } from "ws";
import * as http from "http";
import * as WebSocket from "ws";
import Router = require("koa-router");
import { Application } from "egg";
import { WebSocketLoader } from "./loader";
const co = require('co');


export class WebSocketIniter {
  webSocketLoader: WebSocketLoader;
  webSocketServer: WebSocketServer;
  constructor(
    private app: Application
  ) {
    this.handlerUpgradeConnection = this.handlerUpgradeConnection.bind(this)
    this.app.on('server', server => {
      this.webSocketServer = new WebSocketServer({ server })
      this.webSocketServer.on('connection', this.handlerUpgradeConnection.bind(this))
    });
    this.webSocketLoader = new WebSocketLoader(app as any);
    this.webSocketLoader.load()
  }


  private handlerUpgradeConnection(socket: WebSocket, request: http.IncomingMessage) {
    let { app } = this;
    if ('upgradeReq' in socket) {
      // @ts-ignore
      request = socket.upgradeReq;
    }
    // @ts-ignore
    // request.ws = socket;
    let response = new http.ServerResponse(request);
    let ctx = app.createContext(request, response);
    ctx.webSocket = socket;
    let wsMiddleWare = getMiddleWare(app);
    let fn = co.wrap(compose(wsMiddleWare))
    fn(ctx).then(function () {
      if (!ctx.wsMatched) {
        socket.close();
      }
    }).catch(function (err: any) {
      app.logger.info('[Worker] [fmp-ws]', err)
      socket.close();
    });
  }

  close() {
    if (this.webSocketServer) {
      this.webSocketServer.off('connection', this.handlerUpgradeConnection);
      this.webSocketServer.close();
    }
  }

}

function getMiddleWare(app: any): any {
  let wsMiddleWare: any[] = [];
  Object.getOwnPropertySymbols(app).forEach((key: any) => {
    if (typeof key == "symbol" && Symbol.keyFor(key) == 'EGG-WS#MIDDLEWARE') {
      wsMiddleWare = app[key];
    }
  })
  return wsMiddleWare;
}


function compose<StateT, CustomT>(middleware: Router.IMiddleware<StateT, CustomT>[]) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context: any, next: any) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch(i: any): any {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next() {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

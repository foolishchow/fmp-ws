import { WebSocketIniter } from "./websocket/server";
import { Application } from "midway";

class FmpWsWorker {
  websocketIniter: WebSocketIniter;
  constructor(public app: Application) {
  }

  // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
  async didLoad() {
    this.app.logger.info("[Worker] fmp-ws init");
    this.websocketIniter = new WebSocketIniter(this.app as any);
  }

  // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
  async willReady() {

  }

  // 请将您的 app.beforeClose 中的代码置于此处。
  async beforeClose() {
    this.websocketIniter.close()
  }

}

module.exports = FmpWsWorker;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./websocket/server");
class FmpWsWorker {
    constructor(app) {
        this.app = app;
    }
    // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
    async didLoad() {
        this.app.logger.info("[Worker] fmp-ws init");
        this.websocketIniter = new server_1.WebSocketIniter(this.app);
    }
    // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
    async willReady() {
    }
    // 请将您的 app.beforeClose 中的代码置于此处。
    async beforeClose() {
        this.websocketIniter.close();
    }
}
module.exports = FmpWsWorker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUFxRDtBQUdyRCxNQUFNLFdBQVc7SUFFZixZQUFtQixHQUFnQjtRQUFoQixRQUFHLEdBQUgsR0FBRyxDQUFhO0lBQ25DLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksd0JBQWUsQ0FBQyxJQUFJLENBQUMsR0FBVSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxLQUFLLENBQUMsU0FBUztJQUVmLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLFdBQVc7UUFDZixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQzlCLENBQUM7Q0FFRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIn0=
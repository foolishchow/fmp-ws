"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http = require("http");
const loader_1 = require("./loader");
const co = require('co');
class WebSocketIniter {
    constructor(app) {
        this.app = app;
        this.handlerUpgradeConnection = this.handlerUpgradeConnection.bind(this);
        this.app.on('server', server => {
            this.webSocketServer = new ws_1.Server({ server });
            this.webSocketServer.on('connection', this.handlerUpgradeConnection.bind(this));
        });
        this.webSocketLoader = new loader_1.WebSocketLoader(app);
        this.webSocketLoader.load();
    }
    handlerUpgradeConnection(socket, request) {
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
        let fn = co.wrap(compose(wsMiddleWare));
        fn(ctx).then(function () {
            if (!ctx.wsMatched) {
                socket.close();
            }
        }).catch(function (err) {
            app.logger.info('[Worker] [fmp-ws]', err);
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
exports.WebSocketIniter = WebSocketIniter;
function getMiddleWare(app) {
    let wsMiddleWare = [];
    Object.getOwnPropertySymbols(app).forEach((key) => {
        if (typeof key == "symbol" && Symbol.keyFor(key) == 'EGG-WS#MIDDLEWARE') {
            wsMiddleWare = app[key];
        }
    });
    return wsMiddleWare;
}
function compose(middleware) {
    if (!Array.isArray(middleware))
        throw new TypeError('Middleware stack must be an array!');
    for (const fn of middleware) {
        if (typeof fn !== 'function')
            throw new TypeError('Middleware must be composed of functions!');
    }
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index)
                return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length)
                fn = next;
            if (!fn)
                return Promise.resolve();
            try {
                return Promise.resolve(fn(context, function next() {
                    return dispatch(i + 1);
                }));
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dlYnNvY2tldC9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBK0M7QUFDL0MsNkJBQTZCO0FBSTdCLHFDQUEyQztBQUMzQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHekIsTUFBYSxlQUFlO0lBRzFCLFlBQ1UsR0FBZ0I7UUFBaEIsUUFBRyxHQUFILEdBQUcsQ0FBYTtRQUV4QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLFdBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7WUFDdEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNqRixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx3QkFBZSxDQUFDLEdBQVUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDN0IsQ0FBQztJQUdPLHdCQUF3QixDQUFDLE1BQWlCLEVBQUUsT0FBNkI7UUFDL0UsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLFlBQVksSUFBSSxNQUFNLEVBQUU7WUFDMUIsYUFBYTtZQUNiLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1NBQzdCO1FBQ0QsYUFBYTtRQUNiLHVCQUF1QjtRQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FB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
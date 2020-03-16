"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsSymbol = Symbol.for('EGG-WS#MIDDLEWARE');
const pathToRegexp = require('path-to-regexp');
function decode(val) {
    if (val)
        return decodeURIComponent(val);
}
const router = function (path, fn, opts) {
    const re = pathToRegexp(path, opts);
    // debug('%s %s -> %s', method || 'ALL', path, re);
    const createRoute = function (routeFunc) {
        return function (ctx, next) {
            // method
            // if (!matches(ctx)) return next();
            // path
            const m = re.exec(ctx.path);
            if (m) {
                const args = m.slice(1).map(decode);
                ctx.routePath = path;
                let params = {};
                re.keys.forEach((key, index) => {
                    if (args[index]) {
                        params[key.name] = args[index];
                    }
                });
                ctx.params = params;
                // debug('%s %s matches %s %j', ctx.method, path, ctx.path, args);
                args.unshift(ctx);
                args.push(next);
                ctx.wsMatched = true;
                return Promise.resolve(routeFunc.apply(ctx, args));
            }
            // miss
            return next();
        };
    };
    if (fn) {
        return createRoute(fn);
    }
    else {
        return createRoute;
    }
};
// Array<Router.IMiddleware<StateT, CustomT>>
function wssOnApplication(app, route, ...middlewares) {
    if (!app[wsSymbol]) {
        app[wsSymbol] = [];
    }
    // @ts-ignore
    let m = router(route, ...middlewares);
    app[wsSymbol].push(m);
}
exports.wssOnApplication = wssOnApplication;
function pipeWebSocket(source, target) {
    source.on('message', (data) => {
        target.send(data);
    });
    source.once('close', () => {
        target.close();
    });
    target.on('message', (data) => {
        source.send(data);
    });
    target.once('close', () => {
        source.close();
    });
}
exports.pipeWebSocket = pipeWebSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvd2Vic29ja2V0L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBRTlDLFNBQVMsTUFBTSxDQUFDLEdBQVE7SUFDdEIsSUFBSSxHQUFHO1FBQUUsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsTUFBTSxNQUFNLEdBQUcsVUFDYixJQUFZLEVBQ1osRUFBeUMsRUFDekMsSUFBVTtJQUVWLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsbURBQW1EO0lBRW5ELE1BQU0sV0FBVyxHQUFHLFVBQVUsU0FBYztRQUMxQyxPQUFPLFVBQVUsR0FBWSxFQUFFLElBQVM7WUFDdEMsU0FBUztZQUNULG9DQUFvQztZQUVwQyxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDZixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDaEM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3BCLGtFQUFrRTtnQkFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3BEO1lBRUQsT0FBTztZQUNQLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDO0lBRUYsSUFBSSxFQUFFLEVBQUU7UUFDTixPQUFPLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN4QjtTQUFNO1FBQ0wsT0FBTyxXQUFXLENBQUM7S0FDcEI7QUFDSCxDQUFDLENBQUE7QUFLRCw2Q0FBNkM7QUFDN0MsU0FBZ0IsZ0JBQWdCLENBQzlCLEdBQWdCLEVBQUUsS0FBVSxFQUM1QixHQUFHLFdBQWtEO0lBRXJELElBQUksQ0FBRSxHQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDMUIsR0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM3QjtJQUNELGFBQWE7SUFDYixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7SUFDckMsR0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBVkQsNENBVUM7QUFHRCxTQUFnQixhQUFhLENBQUMsTUFBaUIsRUFBRSxNQUFpQjtJQUNoRSxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDeEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCxzQ0FhQyJ9
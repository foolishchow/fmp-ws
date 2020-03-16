import { KoaMiddlewareParamArray } from "midway";
export declare const WEBSOCKETS_KEY = "WEBSOCKETS_CLASS";
export interface WebSocketsOption {
    prefix: string;
    routerOptions: {
        sensitive?: boolean;
        middleware?: KoaMiddlewareParamArray;
    };
}
export declare const WebSocketKey = "websocket";
export declare function websocket(path?: string, routerOptions?: {
    routerName?: string;
    middleware?: KoaMiddlewareParamArray;
}): MethodDecorator;
export declare function websockets(prefix: string, routerOptions?: {
    sensitive?: boolean;
    middleware?: KoaMiddlewareParamArray;
}): (target: any) => void;

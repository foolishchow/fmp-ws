import { KoaMiddlewareParamArray, RequestMapping, saveClassMetadata, saveModule, scope, ScopeEnum } from "midway";

export const WEBSOCKETS_KEY = "WEBSOCKETS_CLASS"
export interface WebSocketsOption {
  prefix: string;
  routerOptions: {
    sensitive?: boolean;
    middleware?: KoaMiddlewareParamArray
  };
}

export const WebSocketKey = "websocket"


const PATH_METADATA = 'PATH_METADATA';
const METHOD_METADATA = 'METHOD_METADATA';
const ROUTER_NAME_METADATA = 'ROUTER_NAME_METADATA';
const ROUTER_MIDDLEWARE = 'ROUTER_MIDDLEWARE';

export function websocket(
  path?: string,
  routerOptions: {
    routerName?: string;
    middleware?: KoaMiddlewareParamArray;
  } = { middleware: [] }
): MethodDecorator {
  return RequestMapping({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: "websocket",
    [ROUTER_NAME_METADATA]: routerOptions.routerName,
    [ROUTER_MIDDLEWARE]: routerOptions.middleware,
  });
};

export function websockets(
  prefix: string,
  routerOptions: {
    sensitive?: boolean,
    middleware?: KoaMiddlewareParamArray
  } = { middleware: [], sensitive: true }
) {
  return (target: any) => {
    saveModule(WEBSOCKETS_KEY, target);
    saveClassMetadata(WEBSOCKETS_KEY, {
      prefix,
      routerOptions
    } as WebSocketsOption, target);
    scope(ScopeEnum.Request)(target);
  };
}


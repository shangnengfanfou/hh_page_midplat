import "reflect-metadata";
import { Methods } from './utils';
import Context from '../context';
import { Middleware } from '../middleware';
interface Route {
    path: RegExp;
    pathMatch: Function;
    type: Methods;
    routeMiddlewares: Middleware[];
    routeHandler: (ctx: Context) => Promise<any>;
}
export declare const routes: Route[];
/**
 * @function 类注解
 * @param routePrefix {String} 路由前缀
 */
export declare function Controller(routePrefix: string): (target: Function) => void;
export {};

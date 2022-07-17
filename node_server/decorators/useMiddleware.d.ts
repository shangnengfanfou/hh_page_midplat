import 'reflect-metadata';
import { Middleware } from '../middleware';
/**
 * @function 中间件注解
 * @param middleware {RequestHandler} 加入中间件
 */
export declare function Use(middleware: Middleware): (target: any, key: string, desc: PropertyDescriptor) => void;

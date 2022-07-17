"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
/*  use.ts中间件方法  */
require("reflect-metadata");
const utils_1 = require("./utils");
/**
 * @function 中间件注解
 * @param middleware {RequestHandler} 加入中间件
 */
function Use(middleware) {
    /**
     * @function 目标拦截
     * @param target {Object} 注解目标所在类的实例
     * @param key {String} 注解目标的名称
     * @param desc {Object} 注解目标的属性描述符
     */
    return function (target, key, desc) {
        // 获取当前目标定义在当前获取的中间件前面的中间件列表
        const middlewares = Reflect.getMetadata(utils_1.MetadataKey.MIDDLEWARE, target, key) || [];
        // 合并定义当前目标上的所有中间件
        Reflect.defineMetadata(utils_1.MetadataKey.MIDDLEWARE, [...middlewares, middleware], target, key);
    };
}
exports.Use = Use;
//# sourceMappingURL=useMiddleware.js.map
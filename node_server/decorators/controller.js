"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.routes = void 0;
require("reflect-metadata");
const path_to_regexp_1 = require("path-to-regexp");
const parameter_1 = require("./parameter");
const parseParams_1 = require("./parseParams");
const utils_1 = require("./utils");
exports.routes = [];
/**
 * @function 类注解
 * @param routePrefix {String} 路由前缀
 */
function Controller(routePrefix) {
    /**
     * @function 目标拦截
     * @param  target {Function} 当前类的构造函数
     */
    return function (target) {
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            if (key === 'constructor')
                continue;
            // 获取构造函数上的原型成员
            const routeHandler = target.prototype[key];
            // 获取原型成员上的路由路径
            const path = Reflect.getMetadata(utils_1.MetadataKey.PATH, target.prototype, key);
            // 获取原型成员上的方法
            const method = Reflect.getMetadata(utils_1.MetadataKey.METHOD, target.prototype, key);
            // 获取原型成员上的中间件
            const middlewares = Reflect.getMetadata(utils_1.MetadataKey.MIDDLEWARE, target.prototype, key) || [];
            const asyncHandler = func => async (ctx) => {
                const paramValues = [];
                const params = parameter_1.paramsMap.get(routeHandler);
                if (params) {
                    const keys = Object.keys(params);
                    for (const key of keys) {
                        paramValues[Number(key)] = await (0, parseParams_1.parseParam)(ctx, params[key]);
                    }
                }
                return new Promise((resolve, reject) => {
                    func(...paramValues)
                        .then((data) => {
                        ctx.respData = data;
                        resolve(data);
                    })
                        .catch(reject);
                });
            };
            const asyncRouteHandler = asyncHandler(routeHandler);
            // 生成校验器控件
            if (path || path === "") { // 生成路由
                exports.routes.push({
                    path: (0, path_to_regexp_1.pathToRegexp)(`${routePrefix}${path}`),
                    pathMatch: (0, path_to_regexp_1.match)(`${routePrefix}${path}`),
                    type: method,
                    routeMiddlewares: middlewares,
                    routeHandler: asyncRouteHandler
                });
            }
        }
    };
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map
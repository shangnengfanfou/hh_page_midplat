"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Del = exports.Post = exports.Put = exports.Get = void 0;
require("reflect-metadata");
const utils_1 = require("./utils");
/**
 * @function 路由绑定
 * @param method {String} 请求方法
 */
function routeBinder(method) {
    /**
     * @function 路径获取
     * @param path {String} 路由路径
     */
    return function (path) {
        /**
         * @function 注解
         * @param target {Object} 注解方法所在类的实例
         * @param key {String} 注解方法名
         * @param desc {PropertyDescriptor} 注解方法中的描述符
         */
        return function (target, key, desc) {
            // 定义路径（路径名，路径值， 所在类实例， 所在方法名称）
            Reflect.defineMetadata(utils_1.MetadataKey.PATH, path, target, key);
            // 定义方法（方法名， 方法值， 所在类实例， 所在方法名称）
            Reflect.defineMetadata(utils_1.MetadataKey.METHOD, method, target, key);
        };
    };
}
exports.Get = routeBinder(utils_1.Methods.GET);
exports.Put = routeBinder(utils_1.Methods.PUT);
exports.Post = routeBinder(utils_1.Methods.POST);
exports.Del = routeBinder(utils_1.Methods.DEL);
exports.Patch = routeBinder(utils_1.Methods.PATCH);
//# sourceMappingURL=routes.js.map
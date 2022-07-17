"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = exports.FormData = exports.Ctx = exports.Param = exports.Body = exports.Query = exports.params = exports.paramsMap = void 0;
require("reflect-metadata");
const utils_1 = require("./utils");
exports.paramsMap = new WeakMap();
function params(type, param) {
    return function (target, methodName, paramIndex) {
        let paramtypes = Reflect.getMetadata('design:paramtypes', target, methodName);
        const classParams = exports.paramsMap.get(target[methodName]) || {};
        classParams[paramIndex] = {
            type,
            param,
            methodName,
            index: paramIndex,
            paramtype: paramtypes[paramIndex]
        };
        exports.paramsMap.set(target[methodName], classParams);
    };
}
exports.params = params;
const Query = (param) => params(utils_1.ParamType.QUERY, param);
exports.Query = Query;
const Body = (param) => params(utils_1.ParamType.BODY, param);
exports.Body = Body;
const Param = (param) => params(utils_1.ParamType.PARAM, param);
exports.Param = Param;
const Ctx = () => params(utils_1.ParamType.CTX);
exports.Ctx = Ctx;
const FormData = (param) => params(utils_1.ParamType.FORM_DATA, param);
exports.FormData = FormData;
const Cookie = () => params(utils_1.ParamType.COOKIE);
exports.Cookie = Cookie;
//# sourceMappingURL=parameter.js.map
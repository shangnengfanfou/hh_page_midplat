"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamType = exports.Methods = exports.MetadataKey = void 0;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey["METHOD"] = "method";
    MetadataKey["PATH"] = "path";
    MetadataKey["MIDDLEWARE"] = "middleware";
    MetadataKey["VALIDATOR"] = "validator";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PATCH"] = "PATCH";
    Methods["DEL"] = "DELETE";
    Methods["PUT"] = "PUT";
})(Methods = exports.Methods || (exports.Methods = {}));
var ParamType;
(function (ParamType) {
    ParamType["QUERY"] = "query";
    ParamType["BODY"] = "body";
    ParamType["PARAM"] = "param";
    ParamType["CTX"] = "ctx";
    ParamType["FORM_DATA"] = "formData";
    ParamType["COOKIE"] = "cookie";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
//# sourceMappingURL=utils.js.map
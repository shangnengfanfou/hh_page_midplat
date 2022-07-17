"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParam = void 0;
const utils_1 = require("./utils");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const parseParam = async (ctx, metadata) => {
    switch (metadata.type) {
        case utils_1.ParamType.QUERY:
            return await parseQueryParam(ctx.query, metadata);
        case utils_1.ParamType.BODY:
            return await parseBodyParam(ctx.body, metadata);
        case utils_1.ParamType.PARAM:
            return await parseParamParam(ctx.params, metadata);
        case utils_1.ParamType.CTX:
            return ctx;
        case utils_1.ParamType.FORM_DATA:
            return parseFormDataParam(ctx, metadata);
        case utils_1.ParamType.COOKIE:
            return ctx.cookies;
        default:
            return null;
    }
};
exports.parseParam = parseParam;
const transformer = (param, value, paramtype) => {
    if (paramtype === Number) {
        if (isNaN(value)) {
            throw new Error(`${param} should be a number, ${typeof value} given`);
        }
        return Number(value);
    }
    if (paramtype(value) && (typeof value === typeof paramtype(value))) {
        return value;
    }
    throw new Error(`${param} should be a ${paramtype.name.toLowerCase()}, ${typeof value} given`);
};
const parseQueryParam = async (query, metadata) => {
    if (metadata.param) {
        const param = metadata.param;
        const value = query[param];
        const paramtype = metadata.paramtype;
        return transformer(param, value, paramtype);
    }
    else if (['Object', 'String', 'Boolean', 'Number', 'Array', 'Object'].includes(metadata.paramtype.name)) {
        throw new Error('must define a dto to parse all query params');
    }
    else {
        let entity = (0, class_transformer_1.plainToClass)(metadata.paramtype, query);
        const errors = await (0, class_validator_1.validate)(entity);
        if (errors.length > 0) {
            throw new Error(errors.map(err => `${Object.values(err.constraints)?.join(',')}`).join(' | '));
        }
        return entity;
    }
};
const parseBodyParam = async (body, metadata) => {
    if (metadata.param) {
        const param = metadata.param;
        const value = body[param];
        const paramtype = metadata.paramtype;
        if (paramtype(value) && (typeof value === typeof paramtype(value))) {
            return value;
        }
        throw new Error(`${param} should be a ${paramtype.name.toLowerCase()}, ${typeof value} given`);
    }
    else if (['Object', 'String', 'Boolean', 'Number', 'Array'].includes(metadata.paramtype.name)) {
        throw new Error('must define a dto to parse all body params');
    }
    else {
        let entity = (0, class_transformer_1.plainToClass)(metadata.paramtype, body);
        const errors = await (0, class_validator_1.validate)(entity);
        if (errors.length > 0) {
            throw new Error(errors.map(err => `${Object.values(err.constraints)?.join(',')}`).join(' | '));
        }
        return entity;
    }
};
const parseParamParam = async (params, metadata) => {
    if (metadata.param) {
        const param = metadata.param;
        const value = params[param];
        const paramtype = metadata.paramtype;
        return transformer(param, value, paramtype);
    }
    else if (['Object', 'String', 'Boolean', 'Number', 'Array'].includes(metadata.paramtype.name)) {
        throw new Error('must define a dto to parse all param params');
    }
    else {
        let entity = (0, class_transformer_1.plainToClass)(metadata.paramtype, params);
        const errors = await (0, class_validator_1.validate)(entity);
        if (errors.length > 0) {
            throw new Error(errors.map(err => `${Object.values(err.constraints)?.join(',')}`).join(' | '));
        }
        return entity;
    }
};
const parseFormDataParam = async (ctx, metadata) => {
    if (!ctx.req.headers['content-type']?.includes('multipart/form-data'))
        return null;
    if (metadata.param) {
        const param = metadata.param;
        if (param === 'data') {
            return ctx.body;
        }
        if (param === 'files') {
            return ctx.files;
        }
    }
    else {
        return { data: ctx.body, files: ctx.files };
    }
};
//# sourceMappingURL=parseParams.js.map
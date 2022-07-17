/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as http from 'http';
import { PassThrough } from 'stream';
interface ObjectData<T = any> {
    [propName: string]: T;
}
interface CookieOption {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    expires?: number;
    sameSite?: 'unspecified' | 'no_restriction' | 'lax' | 'strict';
}
interface File {
    filepath: string;
    filename: string;
    originalFilename: string;
    size: number;
    lastModifiedDate: Date;
    mimetype: string;
    param: string;
}
export default class Context {
    requestId: string;
    ip: string;
    url: string;
    pathRegexp: RegExp;
    env: ObjectData;
    req: http.IncomingMessage;
    res: http.ServerResponse;
    params: ObjectData;
    query: ObjectData;
    body: ObjectData;
    cookies: ObjectData;
    log: ObjectData;
    bodyStream: PassThrough;
    files: File[];
    respData: any;
    bodyBuffer: Buffer;
    isProxy: boolean;
    parseQuery(): void;
    groupParamsByKey(params: any): any;
    parseCookie(): void;
    parseIp(): void;
    parseBody(): Promise<unknown>;
    parseFormData(options?: {
        multiples: boolean;
    }): Promise<unknown>;
    json(value: any): void;
    /**
     * 设置cookie
     * @param option
     */
    setCookie(option: CookieOption): void;
    /**
     * 删除cookie
     * @param name
     */
    removeCookie(name: string): void;
    /**
     * 重定向
     * @param url
     * @param statusCode
     */
    redirect(url: string, statusCode?: 302 | 301): void;
    respond(): http.ServerResponse;
    onerror(err: any): void;
    proxy(to: string, options?: {}): Promise<unknown>;
    sendFile(prefix: string, root: string): http.ServerResponse;
    constructor(req: http.IncomingMessage, res: http.ServerResponse);
}
export {};

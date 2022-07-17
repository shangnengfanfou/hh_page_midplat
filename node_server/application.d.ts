/// <reference types="node" />
/// <reference types="node" />
import * as http from 'http';
import { EventEmitter } from 'events';
import { Middleware } from './middleware';
import Context from './context';
export default class Application extends EventEmitter {
    server: http.Server;
    middleware: Middleware[];
    compose: (middleware: Middleware[]) => Middleware;
    statics: Map<string, string>;
    constructor();
    use(wm: Middleware): this;
    listen(port: number, host?: string): http.Server;
    callback(): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
    handleRequest(ctx: Context): any;
    createContext(req: http.IncomingMessage, res: http.ServerResponse): Context;
    onerror(err: any): void;
    static(prefix: string, root: string): void;
}

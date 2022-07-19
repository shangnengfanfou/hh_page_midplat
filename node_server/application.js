"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const util = require("util");
const events_1 = require("events");
const compose_1 = require("./compose");
const context_1 = require("./context");
const controller_1 = require("./decorators/controller");
class Application extends events_1.EventEmitter {
    server;
    middleware;
    compose;
    statics;
    constructor() {
        super();
        this.middleware = [];
        this.compose = compose_1.default;
        this.statics = new Map();
    }
    use(wm) {
        this.middleware.push(wm);
        return this;
    }
    listen(port, host = '0.0.0.0') {
        this.server = http.createServer(this.callback());
        return this.server.listen(port, host, () => {
            console.log('\x1B[32m%s\x1B[0m', `server lister on ${host}:${port}`);
        });
    }
    callback() {
        if (!this.listenerCount('error'))
            this.on('error', this.onerror);
        const handleRequest = async (req, res) => {
            const ctx = this.createContext(req, res);
            try {
                if (ctx.req.method === 'GET') {
                    for (const [prefix, root] of this.statics) {
                        if (ctx.url.startsWith(prefix)) {
                            return ctx.sendFile(prefix, root);
                        }
                    }
                }
                await ctx.parseBody();
                await ctx.parseFormData();
                return this.handleRequest(ctx);
            }
            catch (err) {
                ctx.onerror(err);
            }
        };
        return handleRequest;
    }
    handleRequest(ctx) {
        const res = ctx.res;
        res.statusCode = 404;
        for (let route of controller_1.routes) {
            const isMatch = route.pathMatch(ctx.url);
            if (isMatch) {
                if (ctx.req.method === route.type) {
                    ctx.res.statusCode = 200;
                    ctx.pathRegexp = route.path;
                    ctx.params = isMatch.params;
                    const onerror = err => ctx.onerror(err);
                    const handleResponse = () => ctx.respond();
                    const middleware = [...this.middleware, ...route.routeMiddlewares, route.routeHandler];
                    const fnMiddleware = this.compose(middleware);
                    return fnMiddleware(ctx, null).then(handleResponse).catch(onerror);
                }
                else {
                    ctx.res.statusCode = 405;
                }
            }
        }
        res.end();
    }
    createContext(req, res) {
        const context = new context_1.default(req, res);
        context.res.setHeader('X-Request-Id', context.requestId);
        return context;
    }
    onerror(err) {
        const isNativeError = Object.prototype.toString.call(err) === '[object Error]' ||
            err instanceof Error;
        if (!isNativeError)
            throw new TypeError(util.format('non-error thrown: %j', err));
        if (err.status === 404)
            return;
        const msg = err.stack || err.toString();
        console.error(`\n${msg.replace(/^/gm, '  ')}\n`);
    }
    static(prefix, root) {
        if (!prefix.startsWith('/'))
            prefix = '/' + prefix;
        this.statics.set(prefix, root);
    }
}
exports.default = Application;
//# sourceMappingURL=application.js.map
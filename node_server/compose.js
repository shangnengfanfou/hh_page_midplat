"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compose(middleware) {
    return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index)
                return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length)
                fn = next;
            if (!fn)
                return Promise.resolve();
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
exports.default = compose;
//# sourceMappingURL=compose.js.map
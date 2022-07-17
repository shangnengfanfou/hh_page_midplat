import Context from './context';
export declare type Next = () => Promise<any>;
export declare type Middleware = (ctx: Context, next: Next) => any;

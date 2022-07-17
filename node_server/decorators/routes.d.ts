import "reflect-metadata";
export declare const Get: (path: string) => (target: any, key: string, desc: PropertyDescriptor) => void;
export declare const Put: (path: string) => (target: any, key: string, desc: PropertyDescriptor) => void;
export declare const Post: (path: string) => (target: any, key: string, desc: PropertyDescriptor) => void;
export declare const Del: (path: string) => (target: any, key: string, desc: PropertyDescriptor) => void;
export declare const Patch: (path: string) => (target: any, key: string, desc: PropertyDescriptor) => void;

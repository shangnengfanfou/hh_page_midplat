import "reflect-metadata";
import { ParamType } from './utils';
export declare const paramsMap: WeakMap<object, any>;
export declare function params(type: ParamType, param?: string): (target: any, methodName: string, paramIndex: number) => void;
export declare const Query: (param?: string) => (target: any, methodName: string, paramIndex: number) => void;
export declare const Body: (param?: string) => (target: any, methodName: string, paramIndex: number) => void;
export declare const Param: (param?: string) => (target: any, methodName: string, paramIndex: number) => void;
export declare const Ctx: () => (target: any, methodName: string, paramIndex: number) => void;
export declare type FormDataParamType = 'data' | 'files';
export declare const FormData: (param?: FormDataParamType) => (target: any, methodName: string, paramIndex: number) => void;
export declare const Cookie: () => (target: any, methodName: string, paramIndex: number) => void;
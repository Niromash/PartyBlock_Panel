export interface IMiddleware<T = {}> {
    import: any;
    config?: T;
}

export default interface WebServerInterface {
    port: number;
    middlewares?: IMiddleware[];
    staticFolder?: any;
}
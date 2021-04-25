import WebServerInterface, {IMiddleware} from '../interface/webServer/IWebServer';
import fastify, {FastifyInstance} from "fastify";
import {bootstrap} from "fastify-decorators";
import {resolve} from "path";

type afterFunction = (error: Error) => void;

export default class WebServer {

    private readonly port: number;
    private middlewares: IMiddleware[];
    private readonly staticFolder: { path: string, folder: string }[];
    private readonly server: FastifyInstance;
    private after: afterFunction = error => console.error(error);

    constructor(options: WebServerInterface) {
        this.port = options.port;
        this.middlewares = options.middlewares || [];
        this.staticFolder = options.staticFolder;
        this.server = fastify({
            logger: true,
            trustProxy: true
        });
    }

    public getServer(): FastifyInstance {
        return this.server;
    }

    public loadMiddlewares(middlewares: IMiddleware[]): this {
        middlewares.forEach(middleware => this.server.register(middleware.import, middleware.config));
        return this;
    }

    public addMiddleware<T>(middleware: IMiddleware<T>): this {
        this.middlewares.push(middleware);
        return this;
    }

    public setMiddlewares(middlewares: IMiddleware[]): this {
        this.middlewares = middlewares;
        return this;
    }

    public setAfter(after: afterFunction){
        this.after = after;
    }

    public start(): void {

        if (this.middlewares) this.loadMiddlewares(this.middlewares);

        this.server.register(bootstrap, {
            directory: resolve(__dirname, '..', `controllers`),
            mask: /Controller\./,
        }).after(this.after);

        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err) throw err;
            console.log('Serveur lancé sur ' + address + ' !')
        });
    }
}
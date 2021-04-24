import WebServerInterface, {IMiddleware} from '../interface/webServer/IWebServer';
import fastify, {FastifyInstance} from "fastify";
import {bootstrap} from "fastify-decorators";
import {resolve} from "path";
import * as fs from "fs";
import SocketManager from "../socket/SocketManager";
import Main from "../Main";
import AbstractSocketListener from "../socket/listeners/AbstractSocketListener";

export default class WebServer {

    private readonly port: number;
    private middlewares: IMiddleware[];
    private readonly staticFolder: { path: string, folder: string }[];
    private readonly server: FastifyInstance;

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

    public start(): void {

        if (this.middlewares) this.loadMiddlewares(this.middlewares);

        this.server.register(bootstrap, {
            directory: resolve(__dirname, '..', `controllers`),
            mask: /Controller\./,
        }).after(() => {
            this.server.io.on('connection', socket => {
                const files = fs.readdirSync(resolve(__dirname, '..', 'socket', 'listeners'));
                for (let fileName of files) {
                    const file = require(resolve(__dirname, '..', 'socket', 'listeners', fileName));
                    const listener: AbstractSocketListener = new file.default();
                    // @ts-ignore
                    socket.on(listener.getListenerName(), (...data: any[]) => listener.run(socket, ...data));
                }
            })
        })

        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err) throw err;
            console.log('Serveur lancé sur ' + address + ' !')
        });
    }
}
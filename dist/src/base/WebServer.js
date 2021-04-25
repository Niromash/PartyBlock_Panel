"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_decorators_1 = require("fastify-decorators");
const path_1 = require("path");
class WebServer {
    constructor(options) {
        this.after = error => console.error(error);
        this.port = options.port;
        this.middlewares = options.middlewares || [];
        this.staticFolder = options.staticFolder;
        this.server = fastify_1.default({
            logger: true,
            trustProxy: true
        });
    }
    getServer() {
        return this.server;
    }
    loadMiddlewares(middlewares) {
        middlewares.forEach(middleware => this.server.register(middleware.import, middleware.config));
        return this;
    }
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    setMiddlewares(middlewares) {
        this.middlewares = middlewares;
        return this;
    }
    setAfter(after) {
        this.after = after;
    }
    start() {
        if (this.middlewares)
            this.loadMiddlewares(this.middlewares);
        this.server.register(fastify_decorators_1.bootstrap, {
            directory: path_1.resolve(__dirname, '..', `controllers`),
            mask: /Controller\./,
        }).after(this.after);
        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err)
                throw err;
            console.log('Serveur lancé sur ' + address + ' !');
        });
    }
}
exports.default = WebServer;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_decorators_1 = require("fastify-decorators");
const path_1 = require("path");
const fs = __importStar(require("fs"));
class WebServer {
    constructor(options) {
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
    start() {
        if (this.middlewares)
            this.loadMiddlewares(this.middlewares);
        this.server.register(fastify_decorators_1.bootstrap, {
            directory: path_1.resolve(__dirname, '..', `controllers`),
            mask: /Controller\./,
        }).after(() => {
            this.server.io.on('connection', socket => {
                const files = fs.readdirSync(path_1.resolve(__dirname, '..', 'socket', 'listeners'));
                for (let fileName of files) {
                    const file = require(path_1.resolve(__dirname, '..', 'socket', 'listeners', fileName));
                    const listener = new file.default();
                    // @ts-ignore
                    socket.on(listener.getListenerName(), (...data) => listener.run(socket, ...data));
                }
            });
        });
        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err)
                throw err;
            console.log('Serveur lancé sur ' + address + ' !');
        });
    }
}
exports.default = WebServer;

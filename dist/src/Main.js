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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebServer_1 = __importDefault(require("./base/WebServer"));
const tslog_1 = require("tslog");
const path = __importStar(require("path"));
const SocketManager_1 = __importDefault(require("./socket/SocketManager"));
const RabbitManager_1 = __importDefault(require("./base/app/RabbitManager"));
const PlaySoundRoute_1 = __importDefault(require("./messagingRoutes/PlaySoundRoute"));
const PauseSoundRoute_1 = __importDefault(require("./messagingRoutes/PauseSoundRoute"));
const StopSoundRoute_1 = __importDefault(require("./messagingRoutes/StopSoundRoute"));
class Main {
    constructor() {
        this.config = require('./storage/config/config.json');
        this.rmqManager = new RabbitManager_1.default('amqp://admin:4sx65EqUC@api.picklemc.fr:5673');
        this.socketManager = new SocketManager_1.default();
        this.webServer = new WebServer_1.default({
            port: 80,
            middlewares: [
                {
                    import: Promise.resolve().then(() => __importStar(require('fastify-sensible')))
                }
            ]
        }).addMiddleware({
            import: Promise.resolve().then(() => __importStar(require('fastify-static'))),
            config: {
                root: path.join(__dirname, 'public'),
                prefix: '/public/'
            }
        }).addMiddleware({
            import: Promise.resolve().then(() => __importStar(require('fastify-socket.io')))
        });
        this.logger = new tslog_1.Logger({
            displayFilePath: "hidden",
            displayFunctionName: false,
            prefix: ['HexoganeBP |'],
            overwriteConsole: true,
            dateTimeTimezone: 'Europe/Paris',
            dateTimePattern: 'day/month/year hour:minute:second.millisecond'
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Register routes
            yield this.rmqManager.registerRoutes(new PlaySoundRoute_1.default(), new PauseSoundRoute_1.default(), new StopSoundRoute_1.default());
            // Connect rabbit
            yield this.rmqManager.connect();
            // Start express server
            this.webServer.start();
            return this;
        });
    }
    getWebServer() {
        return this.webServer;
    }
    getSocketManager() {
        return this.socketManager;
    }
    // public getRmqManager(): RabbitManager {
    //     return this.rmqManager;
    // }
    getConfig() {
        return this.config;
    }
    getLogger() {
        return this.logger;
    }
    debug(...args) {
        var _a;
        if (((_a = process.env) === null || _a === void 0 ? void 0 : _a.ENV) === 'dev')
            (this === null || this === void 0 ? void 0 : this.logger.debug(...args)) || console.debug(...args);
    }
}
exports.default = new Main();

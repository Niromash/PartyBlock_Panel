import WebServer from "./base/WebServer";
import IConfig from "./interface/IConfig";
import {Logger} from "tslog";
import {FastifyStaticOptions} from "fastify-static";
import * as path from "path";
import {ServerOptions} from "socket.io";
import SocketManager from "./socket/SocketManager";
import RabbitManager from "./base/app/RabbitManager";
import PlaySoundRoute from "./messagingRoutes/PlaySoundRoute";
import PauseSoundRoute from "./messagingRoutes/PauseSoundRoute";
import StopSoundRoute from "./messagingRoutes/StopSoundRoute";

class Main {

    private readonly config: IConfig;
    private readonly rmqManager: RabbitManager;
    private readonly webServer: WebServer;
    private readonly socketManager: SocketManager;
    private readonly logger: Logger;

    constructor() {
        this.config = require('./storage/config/config.json');
        this.rmqManager = new RabbitManager('amqp://admin:4sx65EqUC@api.picklemc.fr:5673');
        this.socketManager = new SocketManager();
        this.webServer = new WebServer({
            port: 80,
            middlewares: [
                {
                    import: import('fastify-sensible')
                }
            ]
        }).addMiddleware<FastifyStaticOptions>({
            import: import('fastify-static'),
            config: {
                root: path.join(__dirname, 'public'),
                prefix: '/public/'
            }
        }).addMiddleware<ServerOptions>({
            import: import('fastify-socket.io')
        })

        this.logger = new Logger({
            displayFilePath: "hidden",
            displayFunctionName: false,
            prefix: ['HexoganeBP |'],
            overwriteConsole: true,
            dateTimeTimezone: 'Europe/Paris',
            dateTimePattern: 'day/month/year hour:minute:second.millisecond'
        });
    }

    public async start(): Promise<this> {
        // Register routes
        await this.rmqManager.registerRoutes(
            new PlaySoundRoute(),
            new PauseSoundRoute(),
            new StopSoundRoute()
        );

        // Connect rabbit
        await this.rmqManager.connect();

        // Start express server
        this.webServer.start();

        return this;
    }

    public getWebServer() {
        return this.webServer;
    }

    public getSocketManager(){
        return this.socketManager;
    }

    // public getRmqManager(): RabbitManager {
    //     return this.rmqManager;
    // }

    public getConfig(): IConfig {
        return this.config;
    }

    public getLogger(): Logger {
        return this.logger;
    }

    public debug(...args: any[]) {
        if (process.env?.ENV === 'dev') this?.logger.debug(...args) || console.debug(...args);
    }
}

export default new Main();
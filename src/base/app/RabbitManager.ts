import {connect, Channel} from 'amqplib';
import AbstractRMQRoute, {IMessage} from "../../messagingRoutes/AbstractRMQRoute";
import IGlobal from "../../interface/rmq/IGlobal";

export default class RabbitManager {

    private readonly uri: string;
    private sendChannel: Channel | undefined;
    private consumerChannel: Channel | undefined;
    private routes: AbstractRMQRoute[] = [];
    private readonly PRIMARY_QUEUE_NAME = 'PartyBlock';
    private readonly APP_ID = 'PartyBlock';

    constructor(uri: string) {
        this.uri = uri;
    }

    public async connect(): Promise<void> {
        const promiseConnection = connect(this.uri);
        promiseConnection.then(() => console.log('Connexion à RabbitMQ réussie.'));
        const connection = await promiseConnection;
        this.sendChannel = await connection.createChannel();
        this.consumerChannel = await connection.createChannel();

        await this.assertQueue(this.consumerChannel, this.PRIMARY_QUEUE_NAME);
        await this.consumerChannel.consume(this.PRIMARY_QUEUE_NAME, async msg => {
            if (!msg) return;
            try {
                const parsedContent = JSON.parse(msg.content.toString());
                const routeName = parsedContent.routeName;
                msg.content = parsedContent;
                if (routeName && this.routes.map(route => route.getRouteName()).includes(routeName)) {
                    await this.receive(<IMessage<IGlobal>><unknown>msg);
                    this.consumerChannel?.ack(msg);
                }
            } catch (e) {
            }
        });
    }

    public async removeQueue(queue: string) {
        return this.sendChannel?.deleteQueue(queue);
    }

    public async sendMessageToQueue(queue: string, message: string | {}, routeName?: string, headers = {}): Promise<boolean> {
        return await this.sm(headers, queue, message, routeName);
    }

    public async sendMessage(message: string | {}, routeName?: string, headers = {}): Promise<boolean> {
        return await this.sm(headers, this.PRIMARY_QUEUE_NAME, message, routeName);
    }

    private async sm(headers: {}, queue: string, message: string | {}, routeName?: string): Promise<boolean> {
        if (!this.sendChannel) return false;
        try {
            // if (!(await this.sendChannel.checkQueue(queue))) await this.assertQueue(this.sendChannel, queue);
            await this.sendChannel.sendToQueue(queue, Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify({routeName, ...message}) : JSON.stringify(message))), {
                appId: this.APP_ID,
                headers
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async broadcast(exchangeName: string, message: string | {}, routeName?: string, headers = {}): Promise<boolean> {
        if(!this.sendChannel) return false;
        try {
            await this.sendChannel.publish(exchangeName, '', Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify({routeName, ...message}) : JSON.stringify(message))), {
                appId: this.APP_ID,
                headers
            })
            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    private async assertQueue(channel: Channel, queue: string): Promise<boolean> {
        try {
            await channel.assertQueue(queue, {autoDelete: true});
            return true;
        } catch (e) {
            console.error
            (e);
            return false;
        }
    }

    // public async registerRoute(queue: string, callback: ICallback) {
    //     if (!this.consumerChannel) return false;
    //     await this.consumerChannel.assertQueue(queue, { autoDelete: true });
    //     await this.consumerChannel.consume(queue, msg => {
    //         if (msg != null && this.consumerChannel) {
    //             callback(msg);
    //             this.consumerChannel.ack(msg);
    //         }
    //     });
    // }
    //
    // public async registerRoutes(queue: string, callbacks: ICallback[]) {
    //     if (!this.consumerChannel) return false;
    //     await this.consumerChannel.assertQueue(queue, { autoDelete: true });
    //     await this.consumerChannel.consume(queue, msg => {
    //         if (msg != null && this.consumerChannel) {
    //             callbacks.forEach(callback => callback(msg));
    //             this.consumerChannel.ack(msg);
    //         }
    //     });
    // }

    public registerRoute(route: AbstractRMQRoute) {
        this.routes.push(route);
    }

    public registerRoutes(...routes: AbstractRMQRoute[]) {
        this.routes = [...this.routes, ...routes];
    }

    public async receive(message: IMessage<IGlobal>) {
        try {
            for (const route of this.routes) {
                if (message.content.routeName == route.getRouteName()) await route.run(message.content);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
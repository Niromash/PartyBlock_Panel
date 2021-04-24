"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
class RabbitManager {
    constructor(uri) {
        this.routes = [];
        this.PRIMARY_QUEUE_NAME = 'PartyBlock';
        this.APP_ID = 'PartyBlock';
        this.uri = uri;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const promiseConnection = amqplib_1.connect(this.uri);
            promiseConnection.then(() => console.log('Connexion à RabbitMQ réussie.'));
            const connection = yield promiseConnection;
            this.sendChannel = yield connection.createChannel();
            this.consumerChannel = yield connection.createChannel();
            yield this.assertQueue(this.consumerChannel, this.PRIMARY_QUEUE_NAME);
            yield this.consumerChannel.consume(this.PRIMARY_QUEUE_NAME, (msg) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!msg)
                    return;
                try {
                    const parsedContent = JSON.parse(msg.content.toString());
                    const routeName = parsedContent.routeName;
                    msg.content = parsedContent;
                    if (routeName && this.routes.map(route => route.getRouteName()).includes(routeName)) {
                        yield this.receive(msg);
                        (_a = this.consumerChannel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                    }
                }
                catch (e) {
                }
            }));
        });
    }
    removeQueue(queue) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.sendChannel) === null || _a === void 0 ? void 0 : _a.deleteQueue(queue);
        });
    }
    sendMessageToQueue(queue, message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sm(headers, queue, message, routeName);
        });
    }
    sendMessage(message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sm(headers, this.PRIMARY_QUEUE_NAME, message, routeName);
        });
    }
    sm(headers, queue, message, routeName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sendChannel)
                return false;
            try {
                // if (!(await this.sendChannel.checkQueue(queue))) await this.assertQueue(this.sendChannel, queue);
                yield this.sendChannel.sendToQueue(queue, Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify(Object.assign({ routeName }, message)) : JSON.stringify(message))), {
                    appId: this.APP_ID,
                    headers
                });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    broadcast(exchangeName, message, routeName, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sendChannel)
                return false;
            try {
                yield this.sendChannel.publish(exchangeName, '', Buffer.from(typeof message == 'string' ? message : (routeName ? JSON.stringify(Object.assign({ routeName }, message)) : JSON.stringify(message))), {
                    appId: this.APP_ID,
                    headers
                });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    assertQueue(channel, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield channel.assertQueue(queue, { autoDelete: true });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
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
    registerRoute(route) {
        this.routes.push(route);
    }
    registerRoutes(...routes) {
        this.routes = [...this.routes, ...routes];
    }
    receive(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const route of this.routes) {
                    if (message.content.routeName == route.getRouteName())
                        yield route.run(message.content);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.default = RabbitManager;

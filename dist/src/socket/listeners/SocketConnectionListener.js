"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractSocketListener_1 = __importDefault(require("./AbstractSocketListener"));
const Main_1 = __importDefault(require("../../Main"));
class SocketConnectionListener extends AbstractSocketListener_1.default {
    constructor() {
        super('new_user');
    }
    run(socket, username) {
        console.log(username + ' logged in');
        const socketManager = Main_1.default.getSocketManager();
        socketManager.addSocket({
            username,
            socket
        });
    }
}
exports.default = SocketConnectionListener;

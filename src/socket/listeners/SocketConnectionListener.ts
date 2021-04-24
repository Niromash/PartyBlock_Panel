import AbstractSocketListener from "./AbstractSocketListener";
import type {Socket} from "socket.io";
import Main from "../../Main";

export default class SocketConnectionListener extends AbstractSocketListener {

    constructor() {
        super('new_user');
    }

    public run(socket: Socket, username: string): any {
        console.log(username + ' logged in');
        const socketManager = Main.getSocketManager();
        socketManager.addSocket({
            username,
            socket
        })
    }
}
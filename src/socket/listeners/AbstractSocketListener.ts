import type {Socket} from "socket.io";

export default abstract class AbstractSocketListener {

    private readonly listenerName: string;

    protected constructor(listenerName: string) {
        this.listenerName = listenerName;
    }

    public getListenerName(){
        return this.listenerName;
    }

    public abstract run(socket: Socket, ...data: any[]): any;
}
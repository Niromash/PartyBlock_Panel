import type {Socket} from "socket.io";
import Sounds from "../sounds/Sounds";
import IBlock from "../interface/rmq/IBlock";

export interface ISocket {username: string; socket: Socket}

export default class SocketManager {
    
    private sockets: ISocket[];
    private lastMusicPlayed: Sounds | undefined;

    constructor() {
        this.sockets = [];
    }

    public addSocket(socket: ISocket){
        this.sockets.push(socket);
        return this;
    }

    public removeSocket(username: string) {
        this.sockets = this.sockets.filter(socket => socket.username !== username);
    }
    
    public playSound(sound: Sounds) {
        if(sound.isMusic) this.lastMusicPlayed = sound;
        this.broadcast('play_sound', sound.getFileName());
    }

    public pauseSound(){
        this.broadcast('pause');
    }

    public stop(){
        this.broadcast('stop');
    }

    public changeBlock(block: IBlock){
        this.broadcast('block_change', block.hexaColor);
    }

    private broadcast(event: string, ...data: any[]) {
        for (let socket of this.sockets) socket.socket.emit(event, ...data);
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketManager {
    constructor() {
        this.sockets = [];
    }
    addSocket(socket) {
        this.sockets.push(socket);
        return this;
    }
    removeSocket(username) {
        this.sockets = this.sockets.filter(socket => socket.username !== username);
    }
    playSound(sound) {
        if (sound.isMusic)
            this.lastMusicPlayed = sound;
        this.broadcast('play_sound', sound.getFileName());
    }
    pauseSound() {
        this.broadcast('pause');
    }
    stop() {
        this.broadcast('stop');
    }
    broadcast(event, ...data) {
        for (let socket of this.sockets)
            socket.socket.emit(event, ...data);
    }
}
exports.default = SocketManager;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractSocketListener {
    constructor(listenerName) {
        this.listenerName = listenerName;
    }
    getListenerName() {
        return this.listenerName;
    }
}
exports.default = AbstractSocketListener;

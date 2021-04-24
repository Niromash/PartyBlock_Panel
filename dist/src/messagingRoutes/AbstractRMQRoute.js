"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractRMQRoute {
    constructor(routeName) {
        this.routeName = routeName;
    }
    getRouteName() {
        return this.routeName;
    }
}
exports.default = AbstractRMQRoute;

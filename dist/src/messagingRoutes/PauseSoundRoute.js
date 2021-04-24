"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRMQRoute_1 = __importDefault(require("./AbstractRMQRoute"));
const Main_1 = __importDefault(require("../Main"));
class PauseSoundRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super("pause");
    }
    run(data) {
        Main_1.default.getSocketManager().pauseSound();
    }
}
exports.default = PauseSoundRoute;

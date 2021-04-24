"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRMQRoute_1 = __importDefault(require("./AbstractRMQRoute"));
const Sounds_1 = __importDefault(require("../sounds/Sounds"));
const Main_1 = __importDefault(require("../Main"));
class PlaySoundRoute extends AbstractRMQRoute_1.default {
    constructor() {
        super('playSound');
    }
    run(data) {
        Main_1.default.getSocketManager().playSound(Sounds_1.default.getSoundFromName(data.sound));
    }
}
exports.default = PlaySoundRoute;

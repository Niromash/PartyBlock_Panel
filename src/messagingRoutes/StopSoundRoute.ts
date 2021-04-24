import AbstractRMQRoute from "./AbstractRMQRoute";
import Main from "../Main";

export default class StopSoundRoute extends AbstractRMQRoute {

    constructor() {
        super('stop');
    }

    public run(data: {}): any {
        Main.getSocketManager().stop();
    }
}
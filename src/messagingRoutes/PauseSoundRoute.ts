import AbstractRMQRoute from "./AbstractRMQRoute";
import Main from "../Main";

export default class PauseSoundRoute extends AbstractRMQRoute {

    constructor() {
        super("pause");
    }

    public run(data: {}): any {
        Main.getSocketManager().pauseSound();
    }
}
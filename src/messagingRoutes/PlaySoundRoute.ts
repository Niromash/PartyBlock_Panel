import AbstractRMQRoute from "./AbstractRMQRoute";
import IPlaySound from "../interface/rmq/IPlaySound";
import Sounds from "../sounds/Sounds";
import Main from "../Main";

export default class PlaySoundRoute extends AbstractRMQRoute {

    constructor() {
        super('playSound');
    }

    public run(data: IPlaySound): any {
        Main.getSocketManager().playSound(Sounds.getSoundFromName(data.sound));
    }
}
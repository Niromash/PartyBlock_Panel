import AbstractRMQRoute from "./AbstractRMQRoute";
import IBlock from "../interface/rmq/IBlock";
import Main from "../Main";

export default class BlockChangeRoute extends AbstractRMQRoute {

    constructor() {
        super('changeBlock');
    }

    public run(data: IBlock): any {
        Main.getSocketManager().changeBlock(data);
    }
}
import AbstractRMQRoute from "./AbstractRMQRoute";

export default class BlockChangeRoute extends AbstractRMQRoute {

    constructor() {
        super('blockChange');
    }

    public run(data: {}): any {
    }
}
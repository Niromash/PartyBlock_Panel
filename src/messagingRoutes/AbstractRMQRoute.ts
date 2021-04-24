export interface IMessage<T = Buffer> {
    fields: {
        consumerTag: string;
        deliveryTag: number;
        redelivered: boolean;
        exchange: string;
        routingKey: string;
    };
    properties: {
        contentType: string | undefined;
        contentEncoding: string | undefined;
        headers: {};
        deliveryMode: string | undefined;
        priority: number | undefined;
        correlationId: string | undefined;
        replyTo: string | undefined;
        expiration: number | undefined;
        messageId: string | undefined;
        timestamp: number | undefined;
        type: string | undefined;
        userId: string | undefined;
        appId: string | undefined;
        clusterId: string | undefined;
    };
    content: T;
}

export default abstract class AbstractRMQRoute {

    private readonly routeName: string;

    protected constructor(routeName: string) {
        this.routeName = routeName;
    }

    public getRouteName(){
        return this.routeName;
    }

    public abstract run(data: {}): any;
}
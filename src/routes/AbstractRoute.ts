import {FastifyReply, FastifyRequest} from "fastify";

export default abstract class AbstractRoute {

    public run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {}
}

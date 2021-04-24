import {Controller, GET} from "fastify-decorators";
import {FastifyReply, FastifyRequest} from "fastify";

@Controller('/')
export default class MainController {

    @GET('/')
    public handleIndex = async (req: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile('index.html');
    }
}
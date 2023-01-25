import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/:id/games', {
    onRequest: [authenticate],
  }, async (request) => {

    const getPollParams = z.object({
         id: z.string(),
    });
    //.params é usado quando o dado é um parâmetro contido na url
    //.body   é usado quando o dado ou o conjunto de dados estão contidos no body da requisição 
    const { id } = getPollParams.parse(request.params);

    const games = await prisma.game.findMany({
        orderBy:{
            date:'desc',
        },
        include:{
            guesses:{
                where:{
                    participant: {
                        userId: request.user.sub,
                        pollId: id
                    }
                }
            }
        }
    });

    return { 
        games: games.map(game => {
            return {
                ...game,
                guess: game.guesses.length > 0 ? game.guesses[0] : null,
                guesses: undefined 
            }
        })
    }
  })

}
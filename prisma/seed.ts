import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Joãozinho',
            email: 'Joãozinho@gmail.com',
            avatarUrl: 'https://github.com/diego3g.png'
        }
    })

    const poll = await prisma.poll.create({
        data:{
            title: 'Bolão do Joãozinho',
            code: 'BOL1',
            ownerId: user.id,

            participants:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T12:00:00.201Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',

            guesses: {
                create:{
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant:{
                        connect: {
                            userId_pollId:{
                                userId: user.id,
                                pollId: poll.id
                            }
                        }
                    }
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-04T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AT',

            guesses: {
                create:{
                    firstTeamPoints: 3,
                    secondTeamPoints: 4,

                    participant:{
                        connect: {
                            userId_pollId:{
                                userId: user.id,
                                pollId: poll.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()
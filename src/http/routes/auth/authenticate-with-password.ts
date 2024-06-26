import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_error/BadRequestError'
import { compare } from 'bcryptjs'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Autenticação via email e senha',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userAlreadyExist = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userAlreadyExist) {
        throw new BadRequestError('Usuário ou senha incorreta.')
      }

      const passwordHash = await compare(password, userAlreadyExist.password)

      if (!passwordHash) {
        throw new BadRequestError('Usuário ou senha incorreta.')
      }

      const token = await reply.jwtSign(
        {
          sub: userAlreadyExist.id,
        },
        {
          expiresIn: '1d',
        },
      )

      reply.code(201).send({ token })
    },
  )
}

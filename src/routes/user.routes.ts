import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createUserController } from '../module/user/useCase/createUser'
import { listUserController } from '../module/user/useCase/listUser'
import { deleteUserController } from '../module/user/useCase/deleteUser'
import { alterUserController } from '../module/user/useCase/AlterUser'

export default async function (fastify: FastifyInstance) {
  fastify.post(
    '/createUser',
    (request: FastifyRequest, reply: FastifyReply) => {
      createUserController.handle(request, reply)
    },
  )

  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    listUserController.handle(request, reply)
  })

  fastify.put('/alterUser', (request: FastifyRequest, reply: FastifyReply) => {
    alterUserController.handle(request, reply)
  })

  fastify.delete(
    '/:user_id',
    (request: FastifyRequest, reply: FastifyReply) => {
      const user_id = request.params.user_id
      console.log('Cheguei no delete para o usuário com o ID:', user_id)
      deleteUserController.handle(request, reply, user_id)
    },
  )
}

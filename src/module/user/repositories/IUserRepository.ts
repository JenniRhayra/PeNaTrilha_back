import { User } from '@prisma/client'
import { ICreateUserDTO } from '../DTO/ICreateUserDTO'

export default interface IUserRepository {
  create(user: ICreateUserDTO): Promise<void>
  find(): Promise<User[] | void>
  findById(user_id: string): Promise<User | void>
  findByEmail(email: string): Promise<User | null>
  delete(user_id: string): Promise<void>
  save(user: User): Promise<void>
}

import {v4} from 'uuid'
// import {redis} from '../redis'



export const confirmEmailLink = (userId: string) => {
  const id = v4();

  // redis.set(id, userId, 'ex', 60*60*15)

  return `${process.env.BE_HOST}/user/confirm/${id}`
}

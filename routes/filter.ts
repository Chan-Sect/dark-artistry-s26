import express, {RequestHandler} from 'express'
import User from '../database/collections/users'
import Database, {DatabaseClass} from "../database/main";

const router = express.Router()

const USER = <T extends Database>(Source: DatabaseClass<T>): RequestHandler => async (_, res) =>
{
    // res.json(await Source.count())

    // const filter = allow ?  {} : { $or: [ { 'privacy': 1 }, { 'account': account?.id }, { $and: [{ 'privacy': 2 }, { 'account': { $in: friends } }] } ] }
    // const oldest = (await Application.find({ filter, sort: { time: 1 }, to: 1 }))[0]

    const oldest = (await Source.find({ sort: { createTime: 1 }, to: 1 }))[0]

    res.json({ updateTime: { from: oldest.updateTime.getTime() }, createTime: { from: oldest.createTime.getTime() } })
}

router.get('/users', USER(User))

export default router

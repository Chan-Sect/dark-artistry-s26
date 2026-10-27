import express, {RequestHandler} from 'express'
const router = express.Router()
import User from '../database/collections/users'
import middleware from '../middlewares/users'
import {DataHandler} from "../middlewares";

const ALL: RequestHandler = async (_, res) =>
{
    const users = await User.find()
    res.json(users)
}

const POST: RequestHandler = async (_, res) =>
{
    const { name, mail } = res.locals.body
    const user = new User({ name, mail })
    await user.save()
    res.json(await User.find())
}


const ONE: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    res.json(user)
}

const DELETE: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    await user.delete()
    res.json(await User.find())
}


router.get('/',ALL)
router.get('/:id', ...middleware.ONE, ONE)
router.post('/', POST)
router.delete('/:id', ...middleware.DELETE, DELETE)

export default router
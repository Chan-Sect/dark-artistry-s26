import express, {RequestHandler} from 'express'
import User from '../database/collections/users'
import middleware from '../middlewares/users'
import {DataHandler} from "../middlewares";

const router = express.Router()

const ALL: RequestHandler = async (_, res) =>
{
    const users = await User.find()
    res.json(users)
}

const ONE: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    res.json(user)
}

const POST: DataHandler<User> = async (_, res) =>
{
    const { name, mail, phone } = res.locals.body
    const user = new User({ name, mail, phone })

    await user.save()
    // console.log(await sendQR(mail, name, user.id))
    res.json(user)
}

const PATCH: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    const { name, mail, phone } = res.locals.body

    user.name = name
    user.mail = mail
    user.phone = phone

    await user.save()

    res.json(user)
}

const DELETE: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    await user.delete()
    res.json(await User.find())
}


router.get('/', ALL)
router.get('/:id', ...middleware.ONE, ONE)
router.post('/', POST)
router.patch('/:id', ...middleware.PATCH, PATCH)
router.delete('/:id', ...middleware.DELETE, DELETE)

export default router

import express, {RequestHandler} from 'express'
import User from '../database/collections/users'
import middleware from '../middlewares/users'
import {DataHandler} from "../middlewares";
import Access from '../config/permission/access'
import Require from "../config/permission/require"
import {sendQR} from "../config/mail";

const router = express.Router()

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
    console.log(await sendQR(mail, name, user.id))

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


router.get('/', ALL)
router.get('/:id', ...middleware.ONE, ONE)
router.post('/', POST)
router.delete('/:id', ...Access.AccountStudent.check(Require.FullAccess), ...middleware.DELETE, DELETE)

export default router

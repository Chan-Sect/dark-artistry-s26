import express, {RequestHandler} from 'express'
import User from '../database/collections/users'
import middleware from '../middlewares/users'
import {DataHandler} from "../middlewares";
import File from '../database/main/file'

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


const POST: DataHandler<User> = async (req, res) =>
{
    const { name, mail, phone } = res.locals.body
    const { file } = req

    let image

    if (file)
    {
        const storage = new File(file)
        image = await storage.save()
    }
    const user = new User({ name, mail, phone, image })

    await user.save()
    // console.log(await sendQR(mail, name, user.id))
    res.json(user)
}

const PATCH: DataHandler<User> = async (req, res) =>
{
    const user = res.locals.data
    const { name, mail, phone } = res.locals.body
    const { file } = req

    user.name = name
    user.mail = mail
    user.phone = phone
    if (file)
    {
        const storage = new File(file)
        user.image = await storage.save()
    }

    await user.save()

    res.json(user)
}

const DELETE: DataHandler<User> = async (_, res) =>
{
    const user = res.locals.data
    if (user.image)
    {
        const storage = new File(user.image)
        await storage.delete()
    }
    await user.delete()
    res.json(await User.find())
}


router.get('/', ALL)
router.get('/:id', ...middleware.ONE, ONE)
router.post('/', POST)
router.patch('/:id', ...middleware.PATCH, PATCH)
router.delete('/:id', ...middleware.DELETE, DELETE)

export default router

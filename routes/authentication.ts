import express, {RequestHandler} from 'express'
import User from '../database/collections/users'
import {Error} from '../config/connections/response'

const router = express.Router()

const POST: RequestHandler = async (_, res, next) => {
    const {user} = res.locals.body
    const found = (await User.find({filter: {_id: user}}))[0]

    if (found) res.json(found)
    else next(Error.NotFound({user}))
}


router.post('/', POST)

export default router

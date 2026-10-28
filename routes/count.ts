import express, {RequestHandler} from 'express'
import User from '../database/collections/users.js'
import Database, { DatabaseClass } from "../database/main/index.js";

const router = express.Router()

const GET = <T extends Database>(Source: DatabaseClass<T>): RequestHandler => async (_, res) =>
{
    res.json(await Source.count())
}

router.get('/users', GET(User))

export default router

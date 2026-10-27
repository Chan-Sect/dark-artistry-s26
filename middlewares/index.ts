import {RequestHandler} from "express"
import {Error} from "../config/connections/response"
import Database, {DatabaseClass} from "../database/main"

interface GetDataInterface
{
    ID: <T extends Database>(Source: DatabaseClass<T>) => DataHandler<T>[]
}

export type DataHandler<T extends Database> = RequestHandler<{ id: string }, any, any, any, { data: T }>

const exist = (by: string): RequestHandler => (req, _, next) =>
{
    next(req.params[by] !== null && req.params[by] !== undefined ? null : Error.MissingFields(by))
}

const getDataById = <T extends Database>(Source: DatabaseClass<T>): DataHandler<T> => async (req, res, next) =>
{
    const _id = req.params.id
    const result = (await Source.find({ filter: { _id } }))[0]
    res.locals.data = result
    next(result ? null : Error.NotFound({ _id: req.params.id }))
}

const ID = <T extends Database>(Source: DatabaseClass<T>) => [exist('id'), getDataById(Source)]

export const getDataBy: GetDataInterface = { ID }
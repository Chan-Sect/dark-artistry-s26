import {RequestHandler, Request } from "express"
import {Error} from "../config/connections/response"
import Database, {DatabaseClass} from "../database/main"
import Authentication from '../database/collections/authentication'
import User from '../database/collections/users'

type FetchCookiesType = (request: Request) => Promise<Authentication | undefined>
type FindType = (id: string) => Promise<User | undefined>
type ExistType = (by: string) => RequestHandler
type GetDataType = <T extends Database>(Source: DatabaseClass<T>) => DataHandler<T>

export type DataHandler<T extends Database = any> = RequestHandler<{ id: string }, any, any, any, { data: T, sign: Authentication, account: User }>

const exist: ExistType = by => (req, _, next) =>
{
    next(req.params[by] !== null && req.params[by] !== undefined ? null : Error.MissingFields(by))
}

class Account
{
    private static readonly find: FindType = async id => (await User.find({ filter: { _id: id }}))[0]

    private static readonly fetchCookies: DataHandler = async (_, res, next) =>
    {
        if (res.locals.account) next()
        else
        {
            const id = res.locals.sign.user
            const result = await Account.find(id)

            if (result) res.locals.account = result
            next(result ? null : Error.NotFound({ id }))
        }
    }

    public get byCookies()
    {
        return [Cookies.check, Account.fetchCookies]
    }
}

class Data
{
    private static readonly fetch: GetDataType = Source => async (req, res, next) =>
    {
        const _id = req.params.id
        const result = (await Source.find({ filter: { _id } }))[0]
        res.locals.data = result
        next(result ? null : Error.NotFound({ _id: req.params.id }))
    }

    public readonly byID = <T extends Database>(Source: DatabaseClass<T>) => [exist('id'), Data.fetch(Source)]
}

class Cookies
{
    private static readonly fetch: FetchCookiesType = async req =>
    {
        const { token } = req.cookies

        if (token)
        {
            const authentication = (await Authentication.find({ filter: { _id: token } }))[0]
            if (authentication) return authentication
            else return undefined
        }
        else return undefined
    }

    public static readonly check: DataHandler = async (req, res, next) =>
    {
        if (res.locals.sign) next()
        else
        {
            const sign = await Cookies.fetch(req)

            if (sign)
            {
                res.locals.sign = sign
                next()
            }
            else next(Error.Authentication)
        }
    }
}

export class Get
{
    public static readonly Data = new Data()
    public static readonly User = new Account()
}
import Require from './require.js'
import { RequestHandler, Request as RequestType, Response as ResponseType } from "express"
import { Error } from "../connections/response/index.js";
import {DataHandler, Get} from "../../middlewares/index.js";

interface AccessPermission
{
    system: boolean
    account_student: number
    account_parent: number
    account_employee: number
}

type Key = 'system' | 'account_student' | 'account_parent' | 'account_employee'
type ExceptionType = (request: RequestType, response: ResponseType) => Promise<boolean>
type GetPermissionType = (accessPermission: AccessPermission) => number
type GetMaxType = (role: AccessPermission[]) => AccessPermission
type GrantedType = (require?: Require, exception?: ExceptionType) => RequestHandler
type HaveType = (require?: Require) => RequestHandler
type CheckType = (require?: Require, exception?: ExceptionType) => DataHandler[]
type CanType = (require?: Require) => RequestHandler[]

class Access
{
    private readonly key: Key

    private constructor(key: Key)
    {
        this.key = key
    }

    public static get AccountStudent(): Access
    {
        return new Access('account_student')
    }
    public static get AccountParent(): Access
    {
        return new Access('account_parent')
    }
    public static get AccountEmployee(): Access
    {
        return new Access('account_employee')
    }

    private static get Default(): AccessPermission
    {
        return {
            system: false,
            account_student: 0,
            account_parent: 0,
            account_employee: 0
        }
    }

    private readonly permission: GetPermissionType = accessPermission =>
    {
        switch (this.key)
        {
            case 'account_student': return accessPermission.account_student
            case 'account_parent': return accessPermission.account_parent
            case 'account_employee': return accessPermission.account_employee
            default: return 0
        }
    }

    private readonly granted: GrantedType = (require, exception) => async (req, res, next) =>
    {
        const { account } = res.locals
        const access = Access.get(await account.role())
        const { system } = access

        const permission = this.permission(access)
        res.locals.permission = permission

        if (system) next()
        else if (require === undefined) next(Error.Forbidden)
        else
        {
            const allow = require.check(permission) || (exception ? await exception(req, res) : false)
            next(allow ? null : Error.Forbidden)
        }
    }

    private readonly have: HaveType = require => async (req, res, next) =>
    {
        const { account } = res.locals
        if (account)
        {
            const access = Access.get(await account.role())
            const { system } = access
            const permission = this.permission(access)

            res.locals.allow = system ? true : require === undefined ? false : require.check(permission)
        }
        else res.locals.allow = false

        next()
    }

    public readonly check: CheckType = (require, exception) => [...Get.User.byCookies, this.granted(require, exception)]
    public readonly can: CanType = (require) => [this.have(require)]

    public static readonly get: GetMaxType = roles => roles.reduce((previous, current) =>
    {
        const system = previous.system || current.system
        const account_student = Math.max(previous.account_student, current.account_student)
        const account_parent = Math.max(previous.account_parent, current.account_parent)
        const account_employee = Math.max(previous.account_employee, current.account_employee)
        return { system, account_student, account_parent, account_employee }
    }, Access.Default)
}

export default Access

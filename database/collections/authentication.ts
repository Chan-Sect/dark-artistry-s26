import Database, { DatabaseType } from '../main/index.js'

export interface AuthenticationType extends DatabaseType
{
    user: string,
}

class Authentication extends Database
{
    protected static override readonly directory = 'authentication'
    protected override readonly collection: string = Authentication.directory

    public user: string

    protected override get data(): Record<string, unknown>
    {
        const user = this.user
        return { user }
    }

    public override toJSON()
    {
        return { id: this.id, user: this.user }
    }

    public constructor({ _id, user } : AuthenticationType)
    {
        super(_id)
        this.user = user
    }
}

export default Authentication

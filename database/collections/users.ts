import Database, {DatabaseType} from '../main/index.js'

export interface UserType extends DatabaseType
{
    name: string,
    mail: string
}

class User extends Database
{
    protected static override readonly directory = 'users'
    protected override readonly collection: string = User.directory

    public name: string
    public mail: string

    protected override get data(): Record<string, unknown>
    {
        const name = this.name
        const mail = this.mail
        return { name, mail }
    }

    public override toJSON()
    {
        return { id: this.id, name: this.name, mail: this.mail }
    }

    public constructor({ _id, name, mail } : UserType)
    {
        super(_id)
        this.name = name || _id || ''
        this.mail = mail
    }
}

export default User

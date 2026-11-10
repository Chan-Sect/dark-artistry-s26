import Database, {DatabaseType} from '../main'

export interface UserType extends DatabaseType
{
    name: string,
    mail: string,
    phone: string
}

class User extends Database
{
    protected static override readonly directory = 'users'
    protected override readonly collection: string = 'users'

    public name: string
    public mail: string
    public phone: string

    protected override get data(): Record<string, unknown>
    {
        const name = this.name
        const mail = this.mail
        const phone = this.phone
        return { name, mail, phone }
    }

    public override toJSON()
    {
        return { id: this.id, name: this.name, mail: this.mail, phone: this.phone, createTime: this.createTime.getTime(), updateTime: this.updateTime.getTime() }
    }

    public constructor({ _id, createTime, updateTime, name, mail, phone } : UserType)
    {
        super({ id: _id, createTime, updateTime })
        this.name = name || _id || ''
        this.mail = mail || ''
        this.phone = phone || ''
    }
}

export default User

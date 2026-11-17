import Database, {DatabaseType} from '../main'

export interface UserType extends DatabaseType
{
    name: string,
    mail: string,
    phone: string,
    image?: string,
}

class User extends Database
{
    protected static override readonly directory = 'users'
    protected override readonly collection: string = 'users'

    public name: string
    public mail: string
    public phone: string
    public image?: string

    protected override get data(): Record<string, unknown>
    {
        const name = this.name
        const mail = this.mail
        const phone = this.phone
        const image = this.image
        return { name, mail, phone, image }
    }

    public override toJSON()
    {
        return { id: this.id, name: this.name, mail: this.mail, phone: this.phone, image: this.image, createTime: this.createTime.getTime(), updateTime: this.updateTime.getTime() }
    }

    public constructor({ _id, createTime, updateTime, name, mail, phone, image } : UserType)
    {
        super({ id: _id, createTime, updateTime })
        this.name = name || _id || ''
        this.mail = mail || ''
        this.phone = phone || ''
        this.image = image
    }
}

export default User

enum Value
{
    None = 1,
    Readable = 2,
    Insertable = 3,
    Editable = 4,
    FullAccess = 5
}

type CheckType = (value: number) => boolean

class Require
{
    private readonly value: Value

    private constructor(value: Value)
    {
        this.value = value
    }

    public static get None()
    {
        return new Require(Value.None)
    }
    public static get Readable()
    {
        return new Require(Value.Readable)
    }
    public static get Insertable()
    {
        return new Require(Value.Insertable)
    }
    public static get Editable()
    {
        return new Require(Value.Editable)
    }
    public static get FullAccess()
    {
        return new Require(Value.FullAccess)
    }

    public readonly check: CheckType = value => this.value <= value
}

export default Require
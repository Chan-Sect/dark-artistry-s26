import {collection as collections} from "./connect";

// const normalize = (field: string) =>
// {
//     const MAP = [
//         { from: "á", to: "a" }, { from: "à", to: "a" }, { from: "ả", to: "a" },
//         { from: "ã", to: "a" }, { from: "ạ", to: "a" },
//         { from: "ă", to: "a" }, { from: "ắ", to: "a" }, { from: "ằ", to: "a" },
//         { from: "ẳ", to: "a" }, { from: "ẵ", to: "a" }, { from: "ặ", to: "a" },
//         { from: "â", to: "a" }, { from: "ấ", to: "a" }, { from: "ầ", to: "a" },
//         { from: "ẩ", to: "a" }, { from: "ẫ", to: "a" }, { from: "ậ", to: "a" },
//
//         { from: "é", to: "e" }, { from: "è", to: "e" }, { from: "ẻ", to: "e" },
//         { from: "ẽ", to: "e" }, { from: "ẹ", to: "e" },
//         { from: "ê", to: "e" }, { from: "ế", to: "e" }, { from: "ề", to: "e" },
//         { from: "ể", to: "e" }, { from: "ễ", to: "e" }, { from: "ệ", to: "e" },
//
//         { from: "í", to: "i" }, { from: "ì", to: "i" }, { from: "ỉ", to: "i" },
//         { from: "ĩ", to: "i" }, { from: "ị", to: "i" },
//
//         { from: "ó", to: "o" }, { from: "ò", to: "o" }, { from: "ỏ", to: "o" },
//         { from: "õ", to: "o" }, { from: "ọ", to: "o" },
//         { from: "ô", to: "o" }, { from: "ố", to: "o" }, { from: "ồ", to: "o" },
//         { from: "ổ", to: "o" }, { from: "ỗ", to: "o" }, { from: "ộ", to: "o" },
//         { from: "ơ", to: "o" }, { from: "ớ", to: "o" }, { from: "ờ", to: "o" },
//         { from: "ở", to: "o" }, { from: "ỡ", to: "o" }, { from: "ợ", to: "o" },
//
//         { from: "ú", to: "u" }, { from: "ù", to: "u" }, { from: "ủ", to: "u" },
//         { from: "ũ", to: "u" }, { from: "ụ", to: "u" },
//         { from: "ư", to: "u" }, { from: "ứ", to: "u" }, { from: "ừ", to: "u" },
//         { from: "ử", to: "u" }, { from: "ữ", to: "u" }, { from: "ự", to: "u" },
//
//         { from: "ý", to: "y" }, { from: "ỳ", to: "y" }, { from: "ỷ", to: "y" },
//         { from: "ỹ", to: "y" }, { from: "ỵ", to: "y" },
//
//         { from: "đ", to: "d" }, { from: "Đ", to: "d" }
//     ]
//
//     const generate: (string | any) = (input: any, index: number) =>
//     {
//         if (index >= MAP.length) return input
//         return { $replaceAll: { input: generate(input, index + 1), find: MAP[index].from, replacement: MAP[index].to } }
//     }
//
//     return { $toLower: generate(field, 0) }
// }

export interface FindType
{
    filter?: Record<string, unknown>
    lookup?: any[]
    sort?: Record<string, unknown>
    from?: number
    to?: number
    table?: string
    current?: string
    mirror?: string
    fields?: string | undefined
    count?: boolean
    field?: string
}
export interface CountType
{
    filter?: Record<string, unknown>
    lookup?: any[]
}
export interface DatabaseType
{
    _id?: string | undefined
}

export type DatabaseClass<T extends Database> = Pick<typeof Database, "find" | "count"> & (new (data: any) => T)

abstract class Database
{
    protected static readonly directory: string
    protected abstract readonly collection: string

    public readonly id: string

    protected abstract get data(): Record<string, unknown>
    public abstract toJSON(): unknown

    private generate = (max = 20) =>
    {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

        let timestamp = Date.now()
        let tsStr = ''
        while (timestamp > 0)
        {
            tsStr = chars[timestamp % 62] + tsStr
            timestamp = Math.floor(timestamp / 62)
        }

        let randomStr = ''
        for (let i = 0; i < max - tsStr.length; i++) randomStr += chars[Math.floor(Math.random() * 62)]

        return `${ this.collection }-${ tsStr }${ randomStr }`.toLowerCase()
    }

    protected constructor(id: string | undefined)
    {
        this.id = id?.toLowerCase() || this.generate(12)
    }

    private add = async () => await collections(this.collection).insertOne({ _id: this.id, ...this.data })
    private edit = async () => await collections(this.collection).findOneAndUpdate({ _id: this.id }, { $set: this.data })

    public static async find<T extends Database>(this: DatabaseClass<T>,
    {
        filter = {},
        lookup = [],
        sort = {},
        from = 0,
        to = 0,
        table,
        current,
        mirror,
        field,
        count = false
    } : FindType = {}): Promise<T[]>
    {
        const pipeline =
        [
            ...lookup,
            {
                $match: filter
            }
        ]

        if (table && current && mirror)
        {
            const other = { ...sort }
            delete other[current]

            if (count) pipeline.push(
            {
                $lookup:
                {
                    from: table,
                    let: { lockupID: "$_id" },
                    pipeline:
                    [
                        { $match: { $expr: { $eq: [ `$${ mirror }`, "$$lockupID" ] } } },
                        { $count: "total" }
                    ],
                    as: "lookup"
                }
            },
            {
                $unwind:
                {
                    path: "$lookup",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort:
                {
                    priority: 1,
                    "lookup.total": sort![current],
                    ...other,
                    _id: 1
                }
            })
            else if (field) pipeline.push(
            {
                $lookup:
                {
                    from: table,
                    localField: current,
                    foreignField: mirror,
                    as: 'lookup'
                }
            },
            {
                $unwind: "$lookup"
            },
            {
                $sort:
                {
                    priority: 1,
                    [`lookup.${ field }`]: sort![current],
                    ...other,
                    _id: 1
                }
            })
        }
        else pipeline.push({ $sort: { priority: 1, ...sort, _id: 1 } })

        const cursor = collections((this as any).directory).aggregate(pipeline, { collation: { locale: 'vi', strength: 1 } }).skip(from)

        if (to > 0) cursor.limit(to - from)

        const output = await cursor.toArray()
        return output.map(record => new this(record))
    }

    public static async count<T extends Database>(this: DatabaseClass<T>,
    {
        filter = {},
        lookup = []
    } : CountType = {}): Promise<number>
    {
        const pipeline =
        [
            ...lookup!,
            { $match: filter },
            { $count: 'total' }
        ]

        const result = await collections((this as any).directory).aggregate(pipeline, { collation: { locale: 'vi', strength: 1 } }).toArray()
        return result[0]?.total || 0
    }

    public async save()
    {
        const count = await collections(this.collection).countDocuments({ _id: this.id })
        return count > 0 ? this.edit() : this.add()
    }
    public delete = async () => await collections(this.collection).findOneAndDelete({ _id: this.id })
}

export default Database

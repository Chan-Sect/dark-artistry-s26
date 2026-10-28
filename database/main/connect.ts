import {Document, MongoClient, ServerApiVersion} from 'mongodb'
import URL from '../../config/connections/URI/database.js'
import {Error, Success} from '../../config/connections/response/index.js'
import Response from "../../config/connections/response/type.js";

const name = 'cdsg'

const clientOptions =
{
    serverApi:
    {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}

const client = new MongoClient(URL, clientOptions)

const run: () => Promise<Response> = async () =>
{
    try
    {
        await client.connect()
        return Success.Database()
    }
    catch
    {
        return Error.Database()
    }
}

const output = async () => await run()
export default output

export const collection = (collectionName: string) => client.db(name).collection<Document & { _id: string }>(collectionName)
export const stats = async () => await client.db(name).stats()

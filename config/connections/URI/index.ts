import admin from './admin'
import client from './client'
import server from './server'

export interface URIType
{
    path: string
    port: string
}

interface OutputType
{
    frontend: string[]
    admin: string
    client: string
    server: string
}

const toString = (data: URIType) => `${ data.path }:${ data.port }`
const output: OutputType =
{
    frontend: [toString(admin), toString(client)],
    admin: toString(admin),
    client: toString(client),
    server: toString(server)
}

export default output
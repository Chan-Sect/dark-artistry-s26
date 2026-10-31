import {URIType} from "./index";
import 'dotenv/config'

const path = process.env.CLIENT_DOMAIN
const port = '1698'

const output: URIType = { path, port }
export default output
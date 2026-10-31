import {URIType} from "./index";
import 'dotenv/config'

const path = process.env.SERVER_DOMAIN
const port = '31026'

const output: URIType = { path, port }
export default output
import {URIType} from "./index";
import 'dotenv/config'

const path = process.env.ADMIN_DOMAIN
const port = '7109'

const output: URIType = { path, port }
export default output
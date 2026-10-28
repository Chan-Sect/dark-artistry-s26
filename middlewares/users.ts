import {DataHandler, Get} from "./index.js";
import User from "../database/collections/users.js";

const ONE: DataHandler<User>[] = [...Get.Data.byID(User)]
const DELETE: DataHandler<User>[] = [...Get.Data.byID(User)]

export default { ONE, DELETE }

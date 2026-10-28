import {DataHandler, Get} from "./";
import User from "../database/collections/users";

const ONE: DataHandler<User>[] = [...Get.Data.byID(User)]
const DELETE: DataHandler<User>[] = [...Get.Data.byID(User)]

export default { ONE, DELETE }

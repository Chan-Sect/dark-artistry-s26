import {DataHandler, getDataBy} from "./index";
import User from "../database/collections/users";

const ONE: DataHandler<User>[] = [...getDataBy.ID(User)]
const DELETE: DataHandler<User>[] = [...getDataBy.ID(User)]

export default { ONE, DELETE }
import {DataHandler, Get} from "./";
import {Error} from "../config/connections/response";

const checkExistFile: DataHandler = (req, res, next) => {
    const file = req.file

    if (!file) next(Error.MissingFields('file'))
    else {
        res.locals.upload = file
        next()
    }
}

const GET = [...Get.File.byID()]
const POST = [checkExistFile]

export default {GET, POST}

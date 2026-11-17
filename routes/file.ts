import express from 'express'
import {bucket} from "../database/main/connect";
import {DataHandler} from "../middlewares";
import middleware from '../middlewares/file'

const router = express.Router()

const GET: DataHandler = async (_, res) =>
{
    const { file } = res.locals
    res.set('Content-Type', file.metadata?.contentType || 'application/octet-stream')
    bucket().openDownloadStream(file._id).pipe(res)
}

router.get('/:id', ...middleware.GET, GET)

export default router

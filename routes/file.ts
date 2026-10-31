import express from 'express'
import {bucket} from "../database/main/connect";
import {DataHandler} from "../middlewares";
import middleware from '../middlewares/file'
import {Error} from "../config/connections/response";
import {Readable} from "stream";

const router = express.Router()

const GET: DataHandler = async (_, res) => {

    const {file} = res.locals
    res.set('Content-Type', file.metadata?.contentType || 'application/octet-stream')
    bucket().openDownloadStream(file._id).pipe(res)
}

const POST: DataHandler = async (_, res, next) => {
    try {
        const {upload} = res.locals

        const stream = Readable.from(upload.buffer)
        const uploadStream = bucket().openUploadStream(upload.originalname, {metadata: {contentType: upload.mimetype}})

        stream.pipe(uploadStream)

        uploadStream.on('finish', () => res.json({message: 'Upload successful', id: uploadStream.id}))
        uploadStream.on('error', () => next(Error.Database('bucket')))
    } catch (error) {
        next(Error.Database('bucket'))
    }
}


router.get('/:id', ...middleware.GET, GET)
router.post('/', ...middleware.POST, POST)

export default router

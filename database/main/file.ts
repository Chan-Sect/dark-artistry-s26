import {Readable} from "stream";
import {bucket} from "./connect";
import {pipeline} from "node:stream/promises";
import {ObjectId} from "mongodb";

type URLType = string | Express.Multer.File

// interface DetailType
// {
//     x: number
//     y: number
//     width: number
//     height: number
//     rotate: number
//     scaleX: number
//     scaleY: number
// }

class FileController
{
    private readonly url: URLType

    constructor(url: URLType)
    {
        this.url = url
    }

    // public readonly resize = async (detail: DetailType) =>
    // {
    //     if (typeof this.url === "string") return Error.MethodNotAllow
    //     else return await sharp(this.url.buffer).rotate(detail.rotate).flip(detail.scaleY === -1).flop(detail.scaleX === -1).extract({ left: detail.x, top: detail.y, width: detail.width, height: detail.height }).resize({ width: 500, height: 500, fit: 'inside' }).jpeg().toBuffer()
    // }

    public readonly save = async () =>
    {
        if (typeof this.url === "string") return undefined

        try
        {
            const uploadStream = bucket().openUploadStream(this.url.originalname, { metadata: { contentType: this.url.mimetype }})
            await pipeline(Readable.from([this.url.buffer]), uploadStream)
            return uploadStream.id.toString()
        }
        catch (error)
        {
            return undefined
        }
    }

    public readonly delete =  async () =>
    {
        if (typeof this.url === "string") await bucket().delete(new ObjectId(this.url))
    }

}

export default FileController

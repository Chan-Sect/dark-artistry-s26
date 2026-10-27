import express, {RequestHandler} from 'express'
const router = express.Router()

const GET: RequestHandler = async (_, res) =>
{
  res.render('index', { title: 'Express' })
}

router.get('/', GET)
export default router
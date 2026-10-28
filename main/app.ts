import express, {ErrorRequestHandler, RequestHandler} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import {Error} from '../config/connections/response/index.js'
import URI from '../config/connections/URI/index.js'
import cors from 'cors'
import session from 'express-session'
import indexRouter from '../routes/index.js'
import usersRouter from '../routes/users.js'
import countRouter from '../routes/count.js'
import multer from 'multer'

const corsOptions = { origin: URI.frontend, credentials: true, exposedHeaders: ['Content-Disposition'] }

const app = express()

// view engine setup
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'ejs')

const print: RequestHandler = (req, res, next) =>
{
    if (!(req.method === 'OPTIONS' ||req.url.startsWith('/file') || req.url.startsWith('/image') || req.url.startsWith('/audio') || req.url.startsWith('/video') || req.url.startsWith('/bin')))
        logger('dev')(req, res, next)
    else next()
}
const convert: RequestHandler = (req, res, next) =>
{
    const keys = Object.keys(req.body || {})
    const body: Record<string, unknown> = {}
    for (const key of keys)
    {
        try
        {
            body[key] = JSON.parse(req.body[key])
        }
        catch
        {
            body[key] = req.body[key]
        }
    }
    res.locals.body = body
    next()
}

app.use(print)

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(session({ secret: 'Dark Artistry', resave: false, saveUninitialized: true, cookie: { secure: false } }))

app.use(multer().any())
app.use(convert)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/count', countRouter)

const onNotFound: RequestHandler = (req, _, next) =>
{
    next(Error.PageNotFound(req.method, req.url))
}

const onError: ErrorRequestHandler = (err, req, res, _) =>
{
    const { message, code, error } = err.toJSON()
    res.status(code || 500)

    if (req.accepts('html')) res.render('error', { message, code, stack: err.stack })
    else if (req.accepts('json')) res.json({ message, code, error })
    else res.send(`${ code } - ${ message }`)
}

app.use(express.static(path.join(process.cwd(), 'public')))

app.use(onNotFound)
app.use(onError)


export default app

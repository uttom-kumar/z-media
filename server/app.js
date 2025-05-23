import dotenv from 'dotenv'
dotenv.config()
const {DATABASE, REQUEST_NUMBER, REQUEST_TIME, URL_ENCODE, WEB_CACHE, WEB_JSON_SIZE ,LOCAL_URL} = process.env



import express, { Router } from 'express'
import bodyParser from 'body-parser'
const app = express()

import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import fileUpload from 'express-fileupload'

import mongoose from 'mongoose'
import router from './src/routes/api.js'
import cookieParser from 'cookie-parser'

/* ---- ---- */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize())
app.use(helmet())

app.use(cors({
  origin: [
      LOCAL_URL,
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  credentials: true,
}));


app.use(hpp())
app.use(cookieParser())
app.use(express.json({limit : WEB_JSON_SIZE}))
app.use(express.urlencoded({extended : URL_ENCODE}))
const limiter  = rateLimit( {windowMs : REQUEST_TIME, max : REQUEST_NUMBER})
app.use(limiter)
app.set('etag' , WEB_CACHE==='false')


app.use(fileUpload({
  useTempFiles: false
}))

/* ------ ------ */
let URL = DATABASE
let OPTION = {autoIndex : true}
mongoose.connect(URL, OPTION).then(()=> {
    try{
        console.log('Connected to MongoDB')
    }
    catch(e){
        console.log('Connection Error : ', e)
    }
})


// TODO : ROUTING CONFIGURATION
app.use('/api', router)
export default app;
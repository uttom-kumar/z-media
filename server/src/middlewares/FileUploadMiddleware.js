import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import {API_KEY, API_SECRET, CLOUD_NAME} from "../config/config.js";


cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    }
})


const uploadMiddleware = multer({storage: storage}).single('images')




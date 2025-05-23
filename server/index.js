import app from "./app.js"
import dotenv from 'dotenv'
dotenv.config()
const { PORT } = process.env



app.listen(PORT, () => {
    console.log(`server run successfully at http://localhost:${PORT}/api`)
})

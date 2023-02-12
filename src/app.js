import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import gamerRouter from "./routers/gamer.router.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

app.use([gamerRouter])


const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`Server running in port: ${port}`));
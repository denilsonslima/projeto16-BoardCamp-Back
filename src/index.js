import express from "express"
import cors from "cors"
import dotenv from "dotenv";
// import authRouter from "./routes/AuthRoutes.js"
// import productRouter from "./routes/ProductRoutes.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

// app.use([authRouter, productRouter])


const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`Server running in port: ${port}`));
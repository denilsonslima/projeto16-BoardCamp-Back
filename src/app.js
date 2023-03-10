import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import gamerRouter from "./routers/gamer.router.js"
import clienteRouter from "./routers/customers.router.js"
import rentalsRouter from "./routers/rentals.router.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

app.use([gamerRouter, clienteRouter, rentalsRouter])


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
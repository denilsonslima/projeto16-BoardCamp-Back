import { Router } from "express";
import { adicionarAluguel, listarAlugueis } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { Schema } from "../schemas/rentalsSchemas.js";

const router = Router()

router.get("/rentals", listarAlugueis)
router.post("/rentals", validateSchema(Schema), adicionarAluguel)

export default router
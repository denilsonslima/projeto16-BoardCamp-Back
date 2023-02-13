import { Router } from "express";
import { adicionarAluguel, apagarAluguel, finalizarAluguel, listarAlugueis } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { Schema } from "../schemas/rentalsSchemas.js";

const router = Router()

router.get("/rentals", listarAlugueis)
router.post("/rentals", validateSchema(Schema), adicionarAluguel)
router.post("/rentals/:id/return", finalizarAluguel)
router.delete("/rentals/:id", apagarAluguel)

export default router
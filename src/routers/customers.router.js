import { Router } from "express";
import { atualizarCliente, inserirCliente, listarClientes, pegarClientePeloId } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { Schema } from "../schemas/customersSchemas.js";

const router = Router()

router.get("/customers", listarClientes)
router.get("/customers/:id", pegarClientePeloId)
router.post("/customers", validateSchema(Schema), inserirCliente)
router.put("/customers", atualizarCliente)

export default router
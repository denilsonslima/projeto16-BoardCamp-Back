import { Router } from "express";
import { atualizarCliente, inserirCliente, listarClientes, pegarClientePeloId } from "../controllers/customers.controller.js";

const router = Router()

router.get("/customers", listarClientes)
router.get("/customers/:id", pegarClientePeloId)
router.post("/customers", inserirCliente)
router.put("/customers/:id", atualizarCliente)

export default router
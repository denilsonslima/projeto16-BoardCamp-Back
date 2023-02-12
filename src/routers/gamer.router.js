import { Router } from "express";
import { listarJogos, criarJogo } from "../controllers/gamer.controller.js";

const router = Router();

router.get("/games", listarJogos);
router.post("/games", criarJogo)

export default router;
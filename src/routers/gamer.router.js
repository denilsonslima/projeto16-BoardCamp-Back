import { Router } from "express";
import { listarJogos } from "../controllers/gamer.controller.js";

const router = Router();

router.get("/games", listarJogos);

export default router;
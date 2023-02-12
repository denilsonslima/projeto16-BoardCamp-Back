import { db } from "../config/database.js"

export const listarJogos = async (req, res) => {
    try {
        const jogos = await db.query(`
            SELECT * FROM games;
        `)
        res.send(jogos.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
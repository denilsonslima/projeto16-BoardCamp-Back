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

export const criarJogo = async (req, res) => {
    const {name, image, stockTotal, pricePerDay} = req.body
    try {
        if (!name || stockTotal <= 0 || pricePerDay <= 0) return res.sendStatus(400)

        const nameJogo = await db.query(`SELECT * FROM games WHERE name='${name}'`)
        if(nameJogo.rows.length !== 0) return res.sendStatus(409)

        await db.query(`
        INSERT INTO games
        (name, image, "stockTotal", "pricePerDay")
        VALUES ($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay])

        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
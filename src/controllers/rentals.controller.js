import { db } from "../config/database.js"
import dayjs from "dayjs"

export const listarAlugueis = async (req, res) => {
    try {
        const dados = await db.query(`
        SELECT json_build_object(
            'id', r.id,
            'customerId', r."customerId",
            'gameId', r."gameId",
            'rentDate', r."rentDate",
            'daysRented', r."daysRented",
            'returnDate', r."returnDate",
            'originalPrice', r."originalPrice",
            'delayFee', r."delayFee",
            'customer', json_build_object(
                'id', customers.id,
                'name', customers.name
            ),
            'game', json_build_object(
            'id', games.id,
            'name', games.name)
        )
        FROM rentals r
        JOIN customers
            ON customers.id = r."customerId"
        JOIN games
            ON games.id = r."gameId";
        `)

        res.send(dados.rows)
        
    } catch (error) {
        res.sendStatus(500)
    }
}

export const adicionarAluguel = async (req,res) => {
    const {customerId, gameId, daysRented} = req.body;
    const dia = dayjs().format("YYYY-MM-DD")

    try {
        const customerValid = await db.query(`
        SELECT * FROM customers
        WHERE id=$1;    
        `, [customerId])
    
        const gamerValid = await db.query(`
        SELECT * FROM games
        WHERE id=$1;    
        `, [gameId])

        const rentalsValid = await db.query(`
        SELECT * FROM rentals
        WHERE "gameId"=$1;  
        `, [gameId])

        if(customerValid.rows.length === 0 || gamerValid.rows.length === 0 || rentalsValid.rows.length >= gamerValid.rows[0].stockTotal) return res.sendStatus(400)

        const valor = gamerValid.rows[0].pricePerDay * daysRented

        await db.query(`
        INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [customerId, gameId, dia, daysRented, null, valor, null])

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
}
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
        const teste = dados.rows.map(info => (info.json_build_object))

        res.send(teste)
        
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

export const finalizarAluguel = async (req, res) => {
    const id = req.params.id;
    // const data = dayjs().format("YYYY-MM-DD")
    // const dia = dayjs().format("DD")
    try {
        const idExiste = await db.query(`
        SELECT * FROM
        rentals
        JOIN games
        ON rentals."gameId"=games.id
        WHERE rentals.id=$1;
        `, [id])

        if(idExiste.rows.length === 0) return res.sendStatus(404);

        // const teste = await db.query(`
        // select * from rentals where id=$1 AND "returnDate" is null;
        // `, [id])

        // if(teste.rowCount !== 1) return res.sendStatus(400)

        // const diaEntrega = dayjs(idExiste.rows[0].rentDate).format("DD")
        // const delay = (dia - diaEntrega) * idExiste.rows[0].pricePerDay

        // console.log(delay)
        // // db.query(`
        // // UPDATE rentals set
        // // "returnDate"= ${ data }, "delayFee"=${delay} WHERE id=${id};
        // // `)

        // res.send()
        const rentalUpdateQuery = `
        UPDATE rentals
        SET "returnDate" = NOW(),
            "delayFee" = CASE
                            WHEN EXTRACT(DAY FROM age(NOW(), "rentDate")) > "daysRented"
                            THEN ("originalPrice" / "daysRented") * (EXTRACT(DAY FROM age(NOW(), "rentDate")) - "daysRented")
                            ELSE NULL
                         END
        WHERE "id" = $1 AND "returnDate" IS NULL;
        `;
        const rentalUpdate = await db.query(rentalUpdateQuery, [id]);
        if (rentalUpdate.rowCount === 1) {
          return res.sendStatus(200);
        } else {
          return res.sendStatus(400);
        }
    } catch (error) {
        res.sendStatus(500)
    }
}

export const apagarAluguel = async (req, res) => {
    try {
        const { id } = req.params;
        
        let rental = await db.query('SELECT * FROM rentals WHERE "id" = $1', [id]);
        rental = rental.rows[0];
        if (!rental) return res.sendStatus(404);
    
        if (!rental.returnDate) return res.sendStatus(400);
    
        await db.query('DELETE FROM rentals WHERE "id" = $1', [id]);
    
        return res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500)
    }
}

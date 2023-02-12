import { db } from "../config/database.js"

export const listarClientes = async (req, res) => {
    try {
        const clientes = await db.query(`
            SELECT * FROM customers;
        `)
        res.send(clientes.rows)
    } catch (error) {
        res.sendStatus(500)
    }
}
 
export const pegarClientePeloId = async (req, res) => {
    const id = req.params.id;
    try {
        const cliente = await db.query(`
        SELECT * 
        FROM customers 
        WHERE id= $1
        `, [id])

        if(cliente.rows.length === 0) return res.sendStatus(404)

        res.send(cliente.rows[0])
    } catch (error) {
        res.sendStatus(500)
    }
}

export const inserirCliente = async (req, res) => {
    const {name, phone, cpf, birthday} = req.body;
    try {
        const cpfUser = await db.query(`
        SELECT * FROM customers WHERE cpf=$1;
        `, [cpf])

        if(cpfUser.rows.length !== 0 ) return res.sendStatus(409)

        await db.query(`
        INSERT INTO customers
        (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday])
        
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
}

export const atualizarCliente = async (req, res) => {
    const {name, phone, cpf, birthday} = req.body;
    const id = req.params.id;
    try {
        const cliente = await db.query(`
        SELECT * FROM customers WHERE id=$1;
        `, [id])

        const cpfCliente = await db.query(`
        SELECT * FROM customers WHERE cpf=$1;
        `, [cpf])
        
        if(cliente.rows.length === 0) return res.sendStatus(400);

        if(cpfCliente.rows.length > 0 && cpfCliente.rows[0].id !== cliente.rows[0].id) return res.sendStatus(409);

        await db.query(`
        UPDATE customers
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=${id};
        `, [name, phone, cpf, birthday])

        res.send()
    } catch (error) {
        res.sendStatus(500)
    }
}
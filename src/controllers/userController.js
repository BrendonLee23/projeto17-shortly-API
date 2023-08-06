import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from '../database/database.connection.js';


export async function createUser(req, res) {

    const user = req.body;

    try {

        const existingUser = await db.query(`

            SELECT * FROM users WHERE email=$1
        
        `, [user.email]);

        if (existingUser.rowCount > 0) {

            return res.sendStatus(422);

        }

        const passwordHash = bcrypt.hashSync(user.password, 10);

        await db.query(`
        
            INSERT INTO users(name, email, password)
            VALUES ($1, $2, $3)

        `, [user.name, user.email, passwordHash]);

        res.sendStatus(201);

    } catch (e) {

        res.send(e).status(500);

    }

}
export async function userLogin (req, res) {

    const { email, password } = req.body;

    const { rows: users } = await db.query(`
    
        SELECT * FROM users WHERE email=$1

    `, [email]);

    const [user] = users;

    if (!user) {

        return res.sendStatus(404);

    }

    if (bcrypt.compareSync(password, user.password)) {

        const token = v4();

        await db.query(`
        
            INSERT INTO sessions(token, "userId") VALUES ($1, $2)
        
        `, [token, user.id]);

        return res.send(token);

    }

    res.sendStatus(500);

}
export async function getUser(req, res) {

    const { user } = res.locals;

    try {

        res.send(user);

    } catch (e) {

        res.send(e).status(500);

    }

}
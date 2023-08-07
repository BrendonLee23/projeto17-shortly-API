
import bcrypt from 'bcrypt';
import { db } from '../database/database.connection.js';
import { v4 } from 'uuid';


export async function createUser(req, res) {

    const user = req.body;

    try {

        const existingUser = await db.query(`
            SELECT * FROM users WHERE email=$1
        
        `, [user.email]);

        if (existingUser.rowCount > 0) {

            return res.sendStatus(409);

        }
        if (user.password != user.confirmPassword) {
            return res.sendStatus(422);
        }

        const passwordHash = bcrypt.hashSync(user.password, 10);
        const confirmPasswordHash = bcrypt.hashSync(user.confirmPassword, 10);

        await db.query(`
        
            INSERT INTO users(name, email, password, "confirmPassword")
            VALUES ($1, $2, $3, $4)

        `, [user.name, user.email, passwordHash, confirmPasswordHash]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }

}
export async function userLogin(req, res) {

    const { email, password } = req.body;


    try {

        const { rows: users } = await db.query(`
    
    SELECT * FROM users WHERE email=$1

`, [email]);

        const [user] = users;
        console.log(user)
        if (!user) {

            return res.sendStatus(401);

        }

        if (bcrypt.compareSync(password, user.password)) {

            const token = v4();

            await db.query(`
    
        INSERT INTO sessions(token, "userId") VALUES ($1, $2)
    
    `, [token, user.id]);

            return res.send({ token });

        } else {
            res.sendStatus(401)
        }

    } catch (error) {
        res.status(500).send(error.message);
    }



}
export async function getUser(req, res) {

    const { user } = res.locals;

    try {
        
        res.send(user).status(200);

    } catch (e) {

        res.send(e).status(500);

    }

}

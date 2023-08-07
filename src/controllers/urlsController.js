import { customAlphabet } from 'nanoid';
import { db } from '../database/database.connection.js'

export async function insertURL(req, res) {

    const {url} = req.body;
    const user = res.locals.user

    try {

        const nanoid = customAlphabet('1234567890abcdef', 6)

        let newUrl = nanoid();

        const { rows: urlResult } = await db.query(`
            SELECT "shortUrl" FROM urls WHERE "shortUrl"=$1
            `, [newUrl]);

        if (urlResult.length > 0) {
            newUrl = nanoid();
        }

        const resultURL = await db.query(`
            INSERT INTO urls ("userId", "oldURL", "shortUrl", "accessCount") 
            VALUES ($1, $2, $3, $4) RETURNING id, "shortUrl"`, [user.id, url, newUrl, 0]);

        res.status(201).send(resultURL.rows[0])
        /* res.send(resultURL.rows[0]).status(201); */

    } catch (e) {

        res.send(e.message).status(500);
    }
}
export async function getUrl(req, res) {

    const { id } = req.params;

    try {

        const { rows: result } = await db.query(`
        
            SELECT * FROM "urls" where id=$1
        
        `, [id]);

        if ((result.length < 1) || (result[0].deletedAt !== null)) {

            return res.sendStatus(404);

        }

        const response = {

            "id": result[0].id,
            "shortUrl": result[0].newUrl,
            "url": result[0].url

        }

        res.status(200).send(response);

    } catch (e) {

        res.send(e).status(500);

    }

}
export async function getNewUrl(req, res) {

    const { newUrl } = req.params;

    try {

        const { rows: result } = await db.query(`

            SELECT * FROM "urls" WHERE "shortUrl"=$1

        `, [newUrl]);

        if ((result.length < 1) || (result[0].deletedAt !== null)) {

            return res.sendStatus(404);

        }

        let access = result[0].accessCount;
        access++;

        await db.query(`
        
            UPDATE "urls" SET "accessCount"=$1 WHERE "shortUrl"=$2

        `, [views, newUrl]);

        res.redirect(result[0].url);

    } catch (e) {

        res.send(e).status(500);

    }

}
export async function deleteNewUrl(req,res){

    const { id } = req.params;
    const token = res.locals.token;

    try{

        const{rows:urlResult} = await db.query(`

            SELECT * FROM "urls" WHERE id=$1
        
        `, [id]);

        if (urlResult.length === 0){

            return res.sendStatus(404);

        }

        const {rows:result} = await db.query(`

            SELECT sessions.id as "idUrl", sessions.token, "urls"."deletedAt" 
            FROM "sessions" 
            JOIN "urls" 
            ON sessions."userId" = "urls"."userId"
            WHERE "urls".id = $1 AND sessions.token=$2
            
        `, [id, token]);       

        if (result.length === 0){

            return res.sendStatus(422);

        }

        if (result[0].deletedAt!==null){

            return res.sendStatus(406);

        }

        await db.query(`
        
            UPDATE "urls" SET "deletedAt" = NOW() WHERE "id"=$1
        
        `, [id]);

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error.message);
    }

}
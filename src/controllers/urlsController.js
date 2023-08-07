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
        
            SELECT * FROM "urls" WHERE id=$1
        
        `, [id]);


        if (!result.length > 0) {

            return res.sendStatus(404);
        }

        const response = {

            "id": result[0].id,
            "shortUrl": result[0].shortUrl,
            "url": result[0].oldURL

        }

        res.status(200).json(response);

    } catch (e) {

        res.send(e).status(500);

    }

}
export async function getNewUrl(req, res) {

    const { shortUrl } = req.params;

    try {

        const { rows: result } = await db.query(`

            SELECT * FROM urls WHERE "shortUrl"=$1

        `, [shortUrl]);
        console.log(result);

        if (!result.length > 0) {

            return res.sendStatus(404);

        }

        await db.query(`
        
            UPDATE "urls" SET "accessCount"="accessCount" + 1 WHERE "shortUrl"=$1

        `, [ shortUrl]);

        res.redirect(result[0].shortUrl);

    } catch (e) {

        res.send(e).status(500);

    }

}
export async function deleteNewUrl(req,res){

    const { id } = req.params;
    const {user} = res.locals;
    console.log(user);

    try{

        const{rows:urlResult} = await db.query(`

            SELECT * FROM "urls" WHERE id=$1
        
        `, [id]);
        console.log(urlResult);
        if(user.id !== urlResult[0].userId){
            return res.sendStatus(401);
        }

        if (urlResult[0].length === 0){
            return res.sendStatus(404);
        }
        

        await db.query(`
        
        DELETE FROM urls WHERE id = $1
        
        `, [id]);

        res.sendStatus(204)

    } catch (error) {
        res.status(500).send(error.message);
    }

}
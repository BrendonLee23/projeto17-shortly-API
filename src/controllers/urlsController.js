import { customAlphabet } from 'nanoid';
import { connection } from '../config/database.js'

export default async function insertURL(req, res) {

    const url = res.locals.url;

    try {

        const { rows: result } = await connection.query(`
            SELECT * FROM sessions WHERE token=$1
            `, [res.locals.token]);

        if (result.length === 0) {
            return res.sendStatus(422);
        }

        const nanoid = customAlphabet('1234567890abcdef', 6)

        let newUrl = nanoid();

        const response = {
            "newURL": newUrl
        }

        const { rows: urlResult } = await connection.query(`
            SELECT "newURL" FROM "urls" WHERE "newURL"=$1
            `, [newUrl]);


        if (urlResult.length > 0) {
            newUrl = nanoid();
        }

        await connection.query(`
            INSERT INTO "urls" ("userId", url, "newUrl", "accessCount") 
            VALUES ($1, $2, $3, $4)`, [result[0].userId, url, newUrl, 0]);

        res.status(201).send(response);
    } catch (e) {

        res.send(e).status(500);
    }

}
export default async function getUrl(req, res) {

    const { id } = req.params;

    try {

        const { rows: result } = await connection.query(`
        
            SELECT * FROM "urls" where id=$1
        
        `, [id]);

        if ((result.length < 1) || (result[0].deletedAt !== null)) {

            return res.sendStatus(404);

        }

        const response = {

            "id": result[0].id,
            "newURL": result[0].newUrl,
            "url": result[0].url

        }

        res.status(200).send(response);

    } catch (e) {

        res.send(e).status(500);

    }

}
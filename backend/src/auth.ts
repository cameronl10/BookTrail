import express, { Router, Request, Response } from "express";
import { MongoClient } from "mongodb";
import { mongo_client_config, uri } from "./mongodb";

const router: Router = express.Router();

router.get("/user/get_search_history", async (req: Request, res: Response) => {
    const sid = req.query.sid
    if (!sid || typeof sid != "string")
        return res.status(500).send(`SID is not valid, got \"${sid}\"`)
    const doc_limit_string = req.query.limit
    if (doc_limit_string && typeof doc_limit_string != "string")
        return res.status(500).send(`Limit must be a number, got \"${doc_limit_string}\"`)
    const doc_limit = doc_limit_string ? parseInt(doc_limit_string) : 3

    const client = new MongoClient(uri(), mongo_client_config)

    try {
        await client.connect();

        interface SearchQuery {
            query: string
        }
        const history = await client.db("main").collection("searches").find<SearchQuery>({ sid: { $eq: sid } })
            .sort({ timestamp: -1 })
            .project({ _id: 0, query_string: 1 }).limit(doc_limit).toArray()

        const history_string_arr = history.map(entry => entry.query_string)

        return res.status(200).json({ history: history_string_arr })
    }
    catch {
        console.error(`[get_search_history] could not get search history for user with sid ${sid}`)
    }
    finally {
        await client.close();
    }
})

export default router;
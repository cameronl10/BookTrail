import express, { Router, Request, Response } from "express";
import { URL } from "url";
import { OpenLibraryResponse } from "./search_types";
import { mongo_client_config, uri } from "./mongodb";
import { MongoClient } from "mongodb";

const router: Router = express.Router();

const log_search = async (query_string: string, sid: string) => {
    const client = new MongoClient(uri(), mongo_client_config)
    try {
        await client.connect();
        await client.db("main").collection("searches").insertOne({
            sid, query_string, timestamp: new Date()
        })
    }
    catch {
        console.error(`[search/log_search] search ${query_string} for user ${sid} was not logged.`)
    }
    finally {
        await client.close();
    }
}

router.get("/search", async (req: Request, res: Response) => {
    //input sanitization
    const query_string = req.query.q;
    const sid = req.query.sid;

    if(!query_string || typeof query_string != 'string')
        return res.status(500).send(`Query string must be passed in with query param 'q'.
            Query string must also not be an array.
            Query string passed in is ${query_string}`)
    if(!sid || typeof sid != "string")
        return res.status(500).send(`Sid not supplied, or not a string. Provided sid: \"${sid}\"`)
    
    
    // log a search with mongodb
    const mongodb_log_task = log_search(query_string, sid);

    interface RetMatch {
        dewey_decimal: number
        title: string
        description: string
        shelf_id: number
    }
    let matches: RetMatch[] = []

    const url = new URL("https://openlibrary.org/search.json")
    url.searchParams.set("q", query_string)
    url.searchParams.set("limit", "50")

    for (let page = 1; matches.length < 1; page++) {
        if (page > 3) return res.status(500).json({ error: "Cannot Dewey's for this Query" })
        // send request
        url.searchParams.set("page", page.toString())
        const response = await fetch(url.toString())
        if (response.status !== 200) return res.status(500).send(response.statusText)
        // process and add data
        const data: OpenLibraryResponse = await response.json()
        const valid_docs = data.docs.filter(doc => doc.ddc !== undefined && doc.ddc.length > 0 && !isNaN(parseFloat(doc.ddc[0])))
        matches = matches.concat(valid_docs.map(match => ({
            dewey_decimal: parseFloat(match.ddc![0]),
            title: match.title,
            description: "description", // TODO sort this out
            shelf_id: Math.ceil(Math.round(parseFloat(match.ddc![0])) / (1000 / 30))
        } as RetMatch)))
    }

    await mongodb_log_task; // make sure that mongo is done

    return res.json({ match_count: matches.length, matches })
})

export default router;
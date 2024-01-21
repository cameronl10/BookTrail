import express, { Router, Request, Response } from "express";
import { URL } from "url";
import { OpenLibraryResponse } from "./search_types";

const router: Router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    interface RetMatch {
        dewey_decimal: number
        title: string
        description: string
        shelf_id: number
    }
    let matches: RetMatch[] = []

    const url = new URL("https://openlibrary.org/search.json")
    url.searchParams.set("q", req.query.q as string)
    url.searchParams.set("limit", "50")

    for(let page = 1; matches.length < 1; page++) {
        if(page > 3) {
            res.status(500).json({ error: "Cannot Dewey's for this Query" })
            return;
        }
        // send request
        url.searchParams.set("page", page.toString())
        const response = await fetch(url.toString())
        if(response.status !== 200) {
            res.status(500).send(response.statusText)
            return;
        }
        // process and add data
        const data: OpenLibraryResponse = await response.json()
        const valid_docs = data.docs.filter(doc => doc.ddc !== undefined && doc.ddc.length > 0 && !isNaN(parseFloat(doc.ddc[0])))
        matches = matches.concat(valid_docs.map(match => ({
            dewey_decimal: parseFloat(match.ddc![0]),
            title: match.title,
            description: "description",
            shelf_id: Math.ceil(Math.round(parseFloat(match.ddc![0]))/(1000/30))
        } as RetMatch)))
    }

    return res.json({ match_count: matches.length, matches })
})

export default router;
import { URL } from "url";
import { OpenLibraryResponse } from "./search_types";
import { mongo_client_config, uri } from "../mongodb";
import { MongoClient } from "mongodb";

const log_search = async (query_string: string, sid: string | null) => {
    if(!sid) return;
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

export async function GET(req: Request){
    const {searchParams} = new URL(req.url);

    //input sanitization
    const query_string = searchParams.get("q");
    const sid = searchParams.get("sid");

    if(!query_string || typeof query_string != 'string')
        return new Response(`Query string must be passed in with query param 'q'.
            Query string must also not be an array.
            Query string passed in is ${query_string}`, {
                status: 500
            })
    if(sid && typeof sid != "string")
        return new Response(`Sid not supplied, or not a string. Provided sid: \"${sid}\"`, {
            status: 500
        })
    
    
    // log a search with mongodb
    const mongodb_log_task = log_search(query_string, sid);

    interface RetMatch {
        dewey_decimal: number
        title: string
        shelf_id: number
        cover_url?: string
        description?: string
        author?: string
    }
    let matches: RetMatch[] = []

    const url = new URL("https://openlibrary.org/search.json")
    url.searchParams.set("q", query_string)
    url.searchParams.set("limit", "50")
    url.searchParams.set("fields", "ddc_sort,title,author_name,first_sentence,cover_i")

    for (let page = 1; matches.length < 1; page++) {
        if (page > 3) return new Response("Cannot Dewey's for this Query", {
            status: 500
        })
        // send request
        url.searchParams.set("page", page.toString())
        const response = await fetch(url.toString())
        if (response.status !== 200) return new Response(response.statusText, {
            status: 500
        })
        // process and add data
        const data: OpenLibraryResponse = await response.json()
        const valid_docs = data.docs.filter(doc => !!doc.ddc_sort)
        matches = matches.concat(valid_docs.map(match => ({
            dewey_decimal: parseFloat(match.ddc_sort!),
            title: match.title,
            shelf_id: Math.ceil(Math.round(parseFloat(match.ddc_sort!)) / (1000 / 168)),
            cover_url: match.cover_i ? `https://covers.openlibrary.org/b/id/${match.cover_i}-M.jpg` : undefined,
            description: match.first_sentence ? match.first_sentence[0]: undefined,
            author: match.author_name ? match.author_name[0] : undefined
        })))
    }

    await mongodb_log_task; // make sure that mongo is done

    return Response.json({ match_count: matches.length, matches })
}
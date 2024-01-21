import { MongoClient } from "mongodb";
import { mongo_client_config, uri } from "~/app/api/mongodb";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const sid = searchParams.get("sid")
    const doc_limit_string = searchParams.get("limit")
    
    if (!sid || typeof sid != "string")
        return new Response(`SID is not valid, got \"${sid}\"`, {
            status: 500,
        })
    if (doc_limit_string && typeof doc_limit_string != "string")
        return new Response(`Limit must be a number, got \"${doc_limit_string}\"`, {
            status: 500,
        })
    const doc_limit = doc_limit_string ? parseInt(doc_limit_string) : 3

    const client = new MongoClient(uri(), mongo_client_config)

    try {
        await client.connect();
        console.log("[get_search_history] connected to mongodb")
        console.log(uri())
    } catch (e) {
        return new Response(`[get_search_history] could not connect to mongodb, ${JSON.stringify(e)}`, {
            status: 500,
        })
    }

    try {
        interface SearchQuery {
            query: string
        }
        const history = await client.db("main").collection("searches").find<SearchQuery>({ sid: { $eq: sid } })
            .sort({ timestamp: -1 })
            .project({ _id: 0, query_string: 1 }).limit(doc_limit).toArray()

        const history_string_arr = history.map(entry => entry.query_string)
        await client.close();
        return Response.json({ history: history_string_arr })
    }
    catch (e) {
        await client.close();
        return new Response(`[get_search_history] could not get search history for user with sid ${sid}, ${JSON.stringify(e)}`, {
            status: 500,
        })
    }
}
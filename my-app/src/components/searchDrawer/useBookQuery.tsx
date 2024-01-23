import { useUser } from "@auth0/nextjs-auth0/client";
import { FormEventHandler, useRef, useState } from "react";


export interface QueryResult {
    dewey_decimal: string
    title: string
    shelf_id: number
    cover_url?: string
    description?: string
    author?: string
}

export default function useBookQuery(query: string) {
    const { user } = useUser();

    const [queryResult, setQueryResults] = useState<QueryResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [queryError, setQueryError] = useState<string | null>(null);

    const requestQuery = async () => {
        setLoading(true)
        setQueryError(null)

        const url = new URL(window.location.origin + "/api/findbook")
        url.searchParams.set("q", query)
        if (user?.sub) url.searchParams.set("sid", user.sub as string)

        console.log(user)
        const response = await fetch(url.toString())
        if (response.status != 200) {
            console.error(`[query_books] fetch error: ${await response.text()}`)
            setLoading(false)
            setHasResult(true)
            setQueryError("Couldn't fetch books")
            return;
        }
        const data = await response.json()
        setHasResult(true);
        setLoading(false);
        setQueryResults(data.matches);
    }

    return {setHasResult, requestQuery, hasResult, queryResult, loading, queryError}
};
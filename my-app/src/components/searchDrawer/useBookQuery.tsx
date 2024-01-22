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

export default function useBookQuery() {
    const { user } = useUser();

    const searchBoxRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<string>("");
    const [queryData, setQueryData] = useState<QueryResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [queryError, setQueryError] = useState<string | null>(null);
    const query_books: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
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
        setQueryData(data.matches);
    }


    return {setHasResult, setQuery, query_books, searchBoxRef, hasResult, queryData, loading, queryError}
};
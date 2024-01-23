import { FormEventHandler } from "react"
import { SearchIcon } from "~/components/icons"

export default function SearchBox({
  processQueryEvent, query, setQuery, setHasResult, searchBoxRef
}: {
  processQueryEvent: FormEventHandler<HTMLFormElement>, query: string, setQuery: (s: string) => void,
  setHasResult: (b: boolean) => void, searchBoxRef: any
}) {
  return (
    <div id="searchBoxComponent" className="mb-3">
      <form className="flex items-center gap-x-2 relative" onSubmit={processQueryEvent}>
        <SearchIcon className="absolute w-6 h-6 stroke-neutral-400 left-3 top-[50%] translate-y-[-50%]" strokeWidth={2} />
        <input type="search"
          className="px-4 py-2 pl-12 w-full text-xl font-body rounded-xl bg-slate-700 text-neutral-300 focus:outline-none focus:ring-4 duration-600 ease-in-out flex-1"
          placeholder="Search BookTrail"
          onChange={(e) => {
            const new_query = e.target.value
            setQuery(new_query)
          }}
          onBlur={() => {
            query.length == 0 && setHasResult(false)
          }}
          defaultValue={query}
          ref={searchBoxRef}
        />
        {/* <XIcon className="w-10 h-10 stroke-neutral-400" strokeWidth={2} onClick={() => setTopP(SearchBarPositions.LOWER)} /> */}
      </form>
    </div>
  )
}
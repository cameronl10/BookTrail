"use client";
import SearchBox from "./searchbox";
import SearchArea from "./searcharea";
import useBookQuery, { QueryResult } from "./useBookQuery";

export default function MainSearch({ updateShelfNumber }: { updateShelfNumber: (a: number) => void }) {
  const {setHasResult, setQuery, query_books, searchBoxRef, hasResult, queryData, loading, queryError} = useBookQuery();

  return (
    <div
      className="
        w-full flex flex-col gap-y-4 rounded-t-3xl overflow-clip
        fixed transition-[top] z-10
        bg-slate-800 bg-opacity-80 backdrop-blur-md
        [&>div]:mx-4 pt-8 pb-10
      "
      style={{ top: "10%" }}
    >
      <SearchBox setHasResult={setHasResult} setQuery={setQuery} query_books={query_books} searchBoxRef={searchBoxRef}/>

      {/* SCROLL AREA */}
      <SearchArea
        book_clicked_handler={(book: QueryResult) => {
          updateShelfNumber(book.shelf_id)
        }}
        setSearchBox={(s: string) => {
          if (searchBoxRef.current == null) return;
          searchBoxRef.current.value = s;
          setQuery(s);
        }}
        hasResult={hasResult} queryData={queryData} loading={loading} error={queryError} updateShelfNumber={updateShelfNumber}
      />
    </div>
  );
}
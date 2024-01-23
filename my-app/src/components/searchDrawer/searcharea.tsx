import { Oval } from "react-loader-spinner";
import Book from "./book";
import { SearchIcon } from "../icons";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { QueryResult } from "./useBookQuery";

const BookOfTheDay = ({ bookClickedHandler }: { bookClickedHandler: (book: QueryResult) => void }) => (
	<div className="py-3">
		<h1 className="text-2xl font-bold text-white mb-2">Book of The Day:</h1>
		<div onClick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			bookClickedHandler({
				dewey_decimal: "158.1",
				title: "The 7 Habits of Highly Effective People",
				shelf_id: 10,
			})
		}}
			className="hover:cursor-pointer"
		>
			<Book
				auth={"Stephen Covey"}
				desc={"The 7 Habits of Highly Effective People, first published in 1989, is a business and self-help book written by Stephen R. Covey. Covey defines effectiveness as the balance of obtaining desirable results with caring for that which produces those results."}
				name={"The 7 Habits of Highly Effective People"}
				img={"https://m.media-amazon.com/images/I/51ST4ws-CgL._SY445_SX342_.jpg"}
			/>
		</div>
	</div>
);

const Recents = ({ setSearchBox }: { setSearchBox: (s: string) => void }) => {
	const { user } = useUser();
	useEffect(() => {
		if (!user?.sub) {
			setError("Not logged in")
			return setLoading(false)
		}
		setError(null)
		setLoading(true)
		const url = new URL(window.location.origin + "/api/user/get_search_history")
		url.searchParams.set("sid", user.sub)
		url.searchParams.set("limit", "3");

		(async () => {
			interface FetchSearchHistoryResults {
				history: string[]
			}
			const res = await fetch(url.toString())
			if (res.status != 200) {
				setError("Couldn't fetch recent titles")
				console.error("[Recents] fetch error: ", await res.text())
				return setLoading(false)
			}
			const data: FetchSearchHistoryResults = await res.json()


			setUserRecentTitles(data.history)
			if (data.history.length == 0) setError("No recent titles")
			setLoading(false)
		})()
	}, [user])

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [userRecentTitles, setUserRecentTitles] = useState<string[] | null>(null);

	return (
		<div>
			<h1 className="text-2xl font-bold text-white mb-3"> Recents </h1>

			<div className="flex flex-col gap-y-3 h-[180px]">
				{
					loading
						?
						<div className="grid place-items-center py-4">
							<Oval
								height="50"
								width="50"
								color="#ffffff"
								secondaryColor="#ffffff"
								ariaLabel="oval-loading"
								strokeWidth={6}
							/>
						</div>
						:
						error != null || userRecentTitles == null ?
							<div>
								<p className="text-white"> {error} </p>
							</div>
							:
							userRecentTitles.flatMap((title, i, a) => {
								const p = (
									<div className="flex items-center gap-x-4" key={`book-${i}`} onClick={() => setSearchBox(title)}>
										<SearchIcon className="w-4 h-4 stroke-neutral-400" strokeWidth={3} />
										<h2 className="text-neutral-400"> {title} </h2>
									</div>
								)
								if (i < a.length - 1)
									return [p, (<hr className="w-full border-search-light border-neutral-400" key={`gap-${i}`} />)]
								else
									return [p]
							})
				}
			</div>
		</div>
	)
};


export default function SearchArea({
	hasResult, loading, error, bookClickedHandler, queryResults: queryData, setSearchBoxValue: setSearchBox
}: {
	hasResult: boolean, loading: boolean, error: string | null, bookClickedHandler: (book: QueryResult) => void, queryResults: QueryResult[] | null,
	setSearchBoxValue: (s: string) => void
}) {
	if (loading)
		return (
			<div className="grid place-items-center h-32">
				<Oval
					height="50"
					width="50"
					color="#ffffff"
					secondaryColor="#ffffff"
					ariaLabel="oval-loading"
					strokeWidth={6}
				/>
			</div>
		)
	else if (error)
		return (
			<p className="text-white"> {error} </p>
		)
	else if (!hasResult)
		return (
			<>
				<BookOfTheDay bookClickedHandler={bookClickedHandler} />
				<Recents setSearchBox={setSearchBox} />
			</>
		)
	else if (queryData == null) return (<p>Has result is true, but query data is still null</p>)

	return (
		<div className="flex flex-col gap-y-4">
			{queryData.map((book, index) => (
				<div onClick={() => bookClickedHandler(book)} key={`search-book-${index}`} className="hover:cursor-pointer">
					<Book
						key={index}
						auth={book.author ?? "Unknown Author"}
						desc={book.description ?? book.dewey_decimal}
						name={book.title}
						img={book.cover_url}
					/>
				</div>
			))}
		</div>
	)
}
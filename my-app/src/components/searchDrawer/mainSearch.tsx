"use client";
import SearchBox from "./searchbox";
import SearchArea from "./searcharea";
import useBookQuery, { QueryResult } from "./useBookQuery";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerGripper, DrawerTrigger } from "../ui/drawer";

export default function SearchDrawer({ updateShelfNumber }: { updateShelfNumber: (a: number) => void }) {
	const searchBoxRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState<string>("");	
	const { setHasResult, requestQuery, hasResult, queryResult, loading, queryError } = useBookQuery(query);
	const processQueryEvent: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
		setSnap(SnapPoints.HIGH)
		requestQuery()
	}

	const [isScrolled, setIsScrolled] = useState<boolean>(false);
	const [snap, setSnap] = useState<number | string | null>(null);
	const [open, setOpen] = useState(true);
	enum SnapPoints { LOW=0.3, MID=0.6, HIGH=1 }
	useEffect(() => {
		console.log(snap)
	}, [snap])
	return (
		<Drawer
			snapPoints={[SnapPoints.LOW, SnapPoints.MID, SnapPoints.HIGH]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
			modal={false}
			open={open}
			dismissible={false}
		>
			<DrawerContent className="
				bg-slate-800 bg-opacity-80 backdrop-blur-md
				[&>div]:px-4
			">
				<DrawerGripper className="!px-auto"/>
				<SearchBox
					setHasResult={setHasResult}
					processQueryEvent={processQueryEvent}
					query={query} setQuery={setQuery}
					searchBoxRef={searchBoxRef}
				/>
				<hr className="transition-[opacity] duration-400 delay-100 border-slate-400" style={{opacity: Number(isScrolled) }}/>
				<div
					className={`h-[45rem] [&>div:last-child]:pb-10 ${snap === SnapPoints.HIGH ? "overflow-y-auto" : "overflow-hidden"}`}
					onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
				>
					<SearchArea
						bookClickedHandler={(book: QueryResult) => {
							updateShelfNumber(book.shelf_id)
							setSnap(SnapPoints.MID)
							console.log("book clicked", book)
						}}
						setSearchBoxValue={(s: string) => {
							if (searchBoxRef.current == null) return;
							searchBoxRef.current.value = s;
							setQuery(s);
						}}
						hasResult={hasResult} queryResults={queryResult}
						loading={loading} error={queryError}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
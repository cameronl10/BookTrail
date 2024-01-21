export default function navBar(props: {
    auth: string;
    desc: string;
    name: string; 
    img: string | undefined; 
}) {
    return (
        <div className="w-full flex h-40 hover:bg-slate-700">
            <div className="w-3/4 text-white">
                <h1 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden h-8">
                    {props.name}
                </h1>
                <h2 className="text-base text-neutral-400">
                    {props.auth}
                </h2>
                <h3 className="text-sm text-justify whitespace-normal text-ellipsis overflow-hidden h-24 text-neutral-400">
                   {props.desc}
                </h3>
            </div>
            <div className="w-1/4 m-2 px-1 grid place-content-center">
                <img className="max-w-full object-cover" src={props.img} alt="cover"/>
            </div>
        </div>
    )
};

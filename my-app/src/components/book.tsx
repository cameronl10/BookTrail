export default function Book(props: {
    auth: string;
    desc: string;
    name: string; 
    img: string | undefined; 
    onClick?: () => any;
}) {
    return (
        <div className="flex flex-row gap-x-2 w-full h-40 bg-neutral-900 p-4 rounded-xl">
            <div className="px-1 flex-shrink-0">
                <img className="h-full w-20 object-cover" src={props.img} alt="cover"/>
            </div>
            <div className="text-white overflow-hidden">
                <h1 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden">
                    {props.name}
                </h1>
                <h2 className="text-base text-neutral-400 mb-4">
                    {props.auth}
                </h2>
                <h3 className="text-sm text-justify whitespace-normal text-ellipsis overflow-hidden h-24 text-neutral-400">
                   {props.desc}
                </h3>
            </div>
        </div>
    )
};

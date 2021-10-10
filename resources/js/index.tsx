import { useEffect, useState } from "react";
import { getTopParse } from "./api";

const character = "Xepheris";
const region = "eu";
const realm = "Blackmoore";

export function App(): JSX.Element {
    const [data, setData] = useState<unknown | null>(null);

    useEffect(() => {
        getTopParse({ character, region, realm })
            .then((json) => setData(json))
            .catch(console.error);
    }, []);

    return (
        <h1 className="text-red-500">
            {data === null ? "" : JSON.stringify(data)}
        </h1>
    );
}

import { useEffect, useState } from "react";

import { getTopParse } from "./api";

const character = "Xepheris";
const region = "eu";
const realm = "Blackmoore";

export function App(): JSX.Element {
    const [data, setData] = useState<unknown | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const json = await getTopParse({ character, realm, region });
                setData(json);
            } catch (error) {
                console.error(error);
            }
        }

        // eslint-disable-next-line no-void
        void load();
    }, []);

    return (
        <h1 className="text-red-500">
            {data === null ? "" : JSON.stringify(data)}
        </h1>
    );
}

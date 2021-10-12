import type { FormEvent, ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { LoadingHourglass } from "../components/LoadingHourglass";
import { useLatestParse } from "../context/LookupContext";
import { realms } from "../utils/realms";

const parseFromSlugKey = "//";

export function ParseLookup(): JSX.Element {
    const { push } = useHistory();

    const [character, setCharacter] = useState("");
    const [region, setRegion] = useState<null | string>(null);
    const [realm, setRealm] = useState("");
    const [submitted, setSubmited] = useState(false);

    const { data, loading } = useLatestParse(
        {
            character,
            realm,
            region: region ?? "",
        },
        submitted
    );

    useEffect(() => {
        if (submitted && data) {
            push(
                `/${data.combatant.region}/${data.combatant.realm}/${data.combatant.name}`.toLowerCase()
            );
        }
    }, [data, submitted, push]);

    const thisRegionsRealms = region
        ? realms.filter((realm) => realm.region === region)
        : realms
              .map((realm) => ({
                  ...realm,
                  name: `${realm.name} (${realm.region.toUpperCase()})`,
                  slug: `${realm.slug}${parseFromSlugKey}${realm.region}`,
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmited(true);
    }

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        if (name === "character") {
            setCharacter(value);
            return;
        }

        if (name === "region") {
            // reset realm to ensure new selection
            setRegion(value);
            setRealm("");
            return;
        }

        if (name === "realm") {
            // given existing region, must not parse from string
            if (region) {
                setRealm(value);
            } else {
                // parse based on option value
                const [realm, region] = value.split(parseFromSlugKey);
                setRealm(realm);
                setRegion(region);
            }
        }
    }

    return (
        <section aria-labelledby="form-legend">
            <form onSubmit={handleSubmit} className="pt-4">
                <fieldset disabled={loading}>
                    <legend
                        className="font-semibold text-center"
                        id="form-legend"
                    >
                        <h2>Most Recent Parse Lookup</h2>
                    </legend>
                    <div className="flex flex-col px-4 pt-4 m-auto md:flex-row md:justify-between">
                        <div className="flex flex-col justify-center space-x-0 space-y-2 md:justify-start md:flex-row md:space-y-0 md:space-x-2">
                            <input
                                type="text"
                                name="character"
                                required
                                onChange={handleChange}
                                aria-label="character"
                                value={character}
                                placeholder="character"
                                minLength={2}
                                maxLength={12}
                                className="rounded"
                            />

                            <select
                                name="realm"
                                required
                                value={realm}
                                onChange={handleChange}
                                id="realm"
                                className="rounded"
                            >
                                <option
                                    label="realm"
                                    aria-label="realm"
                                    disabled
                                />
                                {thisRegionsRealms.map((realm) => (
                                    <option
                                        key={`${realm.slug}-${realm.region}`}
                                        value={realm.slug}
                                    >
                                        {realm.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="region"
                                required
                                value={region ?? ""}
                                onChange={handleChange}
                                className="rounded"
                            >
                                <option
                                    label="region"
                                    aria-label="region"
                                    disabled
                                />
                                <option value="eu">EU</option>
                                <option value="us">US</option>
                            </select>
                        </div>
                        <div className="flex justify-center pt-2 md:pt-0">
                            <button
                                type="submit"
                                disabled={!region || !character || !realm}
                                className="w-full px-4 py-2 text-white uppercase bg-blue-500 rounded hover:bg-blue-700 md:w-auto disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                            >
                                lookup
                            </button>
                        </div>
                    </div>
                </fieldset>

                {loading ? <LoadingHourglass /> : null}
            </form>
        </section>
    );
}

import React from "react";
import { BiLinkExternal } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { Icon } from "../components/Icon";
import { LoadingHourglass } from "../components/LoadingHourglass";
import { useLatestParse } from "../context/LookupContext";
import {
    classTextColorMap,
    getTextRarityColor,
    qualityRarityColorMap,
} from "../utils/styles";
import { createWCLUrl } from "../utils/url";

export function LatestParse(): JSX.Element {
    const { realm, character, region } = useParams<{
        region: string;
        character: string;
        realm: string;
    }>();

    const { data, loading, error } = useLatestParse(
        {
            realm,
            character,
            region,
        },
        true
    );

    if (error) {
        return (
            <div>
                <div className="flex justify-center pt-4">
                    <img
                        src="/assets/inv_misc_bomb_05.jpg"
                        alt="Error"
                        className="w-16 h-16 rounded"
                    />
                </div>
                <p className="text-center">
                    Oops, encountered an error: <code>{error}</code>
                </p>
            </div>
        );
    }

    if (loading || !data) {
        return <LoadingHourglass />;
    }

    const roundedParse = Math.round(data.encounter.percentile);

    return (
        <section className="px-4 pb-4">
            <div className="flex flex-col items-center pt-4 sm:flex-row justify-evenly">
                <div className="w-full sm:w-5/12">
                    <h1
                        className={`text-3xl font-bold text-center uppercase sm:text-left ${
                            classTextColorMap[
                                data.combatant.class
                                    .toLowerCase()
                                    .split(" ")
                                    .join("")
                            ]
                        }`}
                    >
                        <a
                            href={`https://www.warcraftlogs.com/character/${data.combatant.region}/${data.combatant.realm}/${data.combatant.name}`.toLowerCase()}
                            rel="noreferrer noopener"
                            target="_blank"
                            className="inline-flex sm:flex"
                        >
                            {data.combatant.name}{" "}
                            <BiLinkExternal className="w-4 h-4 ml-2" />
                        </a>
                    </h1>
                    <p className="text-center sm:text-left">
                        {data.combatant.realm} -{" "}
                        {data.combatant.region.toUpperCase()}
                    </p>
                </div>

                <div className="w-full text-center sm:w-2/12">vs</div>

                <div className="w-full text-center sm:w-5/12 sm:text-right">
                    <a
                        href={createWCLUrl({
                            reportID: data.meta.reportID,
                            fightID: data.meta.fightID,
                        })}
                        rel="noreferrer noopener"
                        target="_blank"
                        className="inline-flex justify-end block text-2xl font-bold uppercase sm:flex"
                    >
                        {data.encounter.name}{" "}
                        <BiLinkExternal className="w-4 h-4 ml-2" />
                    </a>

                    <span
                        className={`${getTextRarityColor(
                            data.encounter.percentile
                        )} block sm:initial`}
                    >
                        parsing {roundedParse}% (
                        {data.encounter.rank.toLocaleString()} /{" "}
                        {data.encounter.outOf.toLocaleString()})
                    </span>
                </div>
            </div>

            <div className="pt-4">
                <progress
                    className="w-full rounded"
                    value={roundedParse}
                    max={100}
                >
                    {roundedParse}%
                </progress>
            </div>

            <div className="pt-2">
                <h2>
                    wearing the following gear (itemlevel{" "}
                    {data.combatant.itemLevel}) ...
                </h2>

                <div className="flex flex-col justify-center pt-2 space-x-0 space-y-2 sm:space-x-2 sm:flex-row sm:space-y-0">
                    {data.combatant.gear.map((item) => {
                        const bonus = item.bonusIDs
                            ? `bonus:${item.bonusIDs.join(":")}`
                            : null;
                        const gems = item.gems
                            ? `gems:${item.gems.map((gem) => gem.id).join(":")}`
                            : null;
                        const enchant = item.permanentEnchant
                            ? `ench=${item.permanentEnchant}`
                            : null;

                        const wowheadString = [bonus, gems, enchant]
                            .filter(Boolean)
                            .join("&");

                        return (
                            <a
                                href={`https://wowhead.com/item=${item.id}?${wowheadString}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={item.id}
                                className="flex items-center space-x-2 sm:initial"
                            >
                                <Icon icon={item.icon} alt={item.name} />{" "}
                                <span
                                    className={`initial sm:hidden ${
                                        qualityRarityColorMap[item.quality]
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            <hr className="mt-2 sm:hidden" />

            <div className="pt-2">
                <h2>using the following talents...</h2>

                <div className="flex flex-col justify-center pt-2 space-x-0 space-y-2 sm:space-x-2 sm:flex-row sm:space-y-0">
                    {data.combatant.talents.map((talent) => {
                        return (
                            <a
                                href={`https://wowhead.com/spell=${talent.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={talent.id}
                                className="flex items-center space-x-2 sm:initial"
                            >
                                <Icon icon={talent.icon} alt={talent.name} />
                                <span className="initial sm:hidden">
                                    {talent.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            <hr className="mt-2 sm:hidden" />

            <div className="pt-2">
                <h2>...soulbind & conduits...</h2>

                <div className="flex flex-col justify-center pt-2 space-x-0 space-y-2 sm:space-x-2 sm:flex-row sm:space-y-0">
                    {data.combatant.soulbindPowers.map((soulbindPower) => {
                        return (
                            <a
                                href={`https://wowhead.com/spell=${soulbindPower.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={soulbindPower.id}
                                className="flex items-center space-x-2 sm:initial"
                            >
                                <Icon
                                    icon={soulbindPower.icon}
                                    alt={soulbindPower.name}
                                />

                                <span className="initial sm:hidden">
                                    {soulbindPower.name}
                                </span>
                            </a>
                        );
                    })}

                    {data.combatant.conduitPowers.map((conduit) => {
                        return (
                            <a
                                href={`https://wowhead.com/spell=${conduit.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={conduit.id}
                                className="flex items-center space-x-2 sm:initial"
                            >
                                <Icon icon={conduit.icon} alt={conduit.name} />

                                <span className="initial sm:hidden">
                                    {conduit.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            <hr className="mt-2 sm:hidden" />

            <div className="pt-2">
                <h2>and legendary:</h2>

                <div className="flex flex-col justify-center pt-2 space-x-0 space-y-2 sm:space-x-2 sm:flex-row sm:space-y-0">
                    {data.combatant.legendaryEffects.map((legendary) => {
                        return (
                            <a
                                href={`https://wowhead.com/spell=${legendary.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={legendary.id}
                                className="flex items-center space-x-2 sm:initial"
                            >
                                <Icon
                                    icon={legendary.icon}
                                    alt={legendary.name}
                                />
                                <span className="initial sm:hidden">
                                    {legendary.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

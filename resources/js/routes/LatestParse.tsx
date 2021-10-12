import type { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { BiLinkExternal } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { ExternalLink } from "../components/ExternalLink";
import { GenericError } from "../components/GenericError";
import { Icon } from "../components/Icon";
import { LoadingHourglass } from "../components/LoadingHourglass";
import type { LatestParseResponse } from "../context/LookupContext";
import { useLatestParse } from "../context/LookupContext";
import { capitalize } from "../utils/format";
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
        return <GenericError message={error} goBack />;
    }

    const roundedParse = data
        ? Math.round(data.encounter.percentile)
        : undefined;

    return (
        <>
            <Helmet>
                <title>
                    {data
                        ? `Latest Parse of ${capitalize(data.combatant.name)}`
                        : "loading latest parse..."}
                </title>
            </Helmet>
            <section className="px-4 pb-4">
                <Header
                    {...(data
                        ? {
                              characterName: data.combatant.name,
                              region: data.combatant.region,
                              realm: data.combatant.realm,
                              encounterName: data.encounter.name,
                              fightID: data.meta.fightID,
                              reportID: data.meta.reportID,
                              outOf: data.encounter.outOf,
                              percentile: roundedParse,
                              rank: data.encounter.rank,
                              className: data.combatant.class,
                              spec: data.combatant.spec,
                          }
                        : {
                              characterName: character,
                              region,
                              realm,
                          })}
                />

                <div
                    className={`px-2 py-4 border-l-2 border-r-2 border-coolgray-800 flex ${
                        loading ? "border-b-2" : ""
                    }`}
                >
                    <progress
                        className="w-full rounded"
                        value={roundedParse}
                        max={100}
                    >
                        {roundedParse}%
                    </progress>
                </div>

                {loading ? (
                    <LoadingHourglass />
                ) : data ? (
                    <>
                        <IconContainer
                            title={`Gear (Ø ${data.combatant.itemLevel})`}
                            first
                        >
                            {data.combatant.gear.map((item) => {
                                const bonus = item.bonusIDs
                                    ? `bonus:${item.bonusIDs.join(":")}`
                                    : null;
                                const gems = item.gems
                                    ? `gems:${item.gems
                                          .map((gem) => gem.id)
                                          .join(":")}`
                                    : null;
                                const enchant = item.permanentEnchant
                                    ? `ench=${item.permanentEnchant}`
                                    : null;

                                const wowheadString = [bonus, gems, enchant]
                                    .filter(Boolean)
                                    .join("&");

                                return (
                                    <ExternalLink
                                        href={`https://wowhead.com/item=${item.id}?${wowheadString}`}
                                        key={item.id}
                                        className="flex items-center space-x-2 sm:initial"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            alt={item.name}
                                        />{" "}
                                        <span
                                            className={`initial sm:hidden ${
                                                qualityRarityColorMap[
                                                    item.quality
                                                ]
                                            }`}
                                        >
                                            {item.name}
                                        </span>
                                    </ExternalLink>
                                );
                            })}
                        </IconContainer>

                        <IconContainer title="Legendary">
                            {data.combatant.legendaryEffects.map(
                                (legendary) => {
                                    return (
                                        <ExternalLink
                                            href={`https://wowhead.com/spell=${legendary.id}`}
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
                                        </ExternalLink>
                                    );
                                }
                            )}
                        </IconContainer>

                        <IconContainer title="Talents">
                            {data.combatant.talents.map((talent) => {
                                return (
                                    <ExternalLink
                                        href={`https://wowhead.com/spell=${talent.id}`}
                                        key={talent.id}
                                        className="flex items-center space-x-2 sm:initial"
                                    >
                                        <Icon
                                            icon={talent.icon}
                                            alt={talent.name}
                                        />
                                        <span className="initial sm:hidden">
                                            {talent.name}
                                        </span>
                                    </ExternalLink>
                                );
                            })}
                        </IconContainer>

                        <IconContainer title="Soulbind & Conduits" last>
                            {data.combatant.soulbindPowers.map(
                                (soulbindPower) => {
                                    return (
                                        <ExternalLink
                                            href={`https://wowhead.com/spell=${soulbindPower.id}`}
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
                                        </ExternalLink>
                                    );
                                }
                            )}

                            {data.combatant.conduitPowers.map((conduit) => {
                                return (
                                    <ExternalLink
                                        href={`https://wowhead.com/spell=${conduit.id}`}
                                        key={conduit.id}
                                        className="flex items-center space-x-2 sm:initial"
                                    >
                                        <Icon
                                            icon={conduit.icon}
                                            alt={conduit.name}
                                        />

                                        <span className="initial sm:hidden">
                                            {conduit.name}
                                        </span>
                                    </ExternalLink>
                                );
                            })}
                        </IconContainer>
                    </>
                ) : null}
            </section>
        </>
    );
}

type IconContainerProps = {
    title: string;
    children: ReactNode;
    last?: boolean;
    first?: boolean;
};

function IconContainer({
    title,
    children,
    last,
    first,
}: IconContainerProps): JSX.Element {
    return (
        <div
            className={` border-l-2 border-r-2 border-coolgray-800 ${
                last ? "border-b rounded-bl rounded-br pb-2" : ""
            } ${first ? "" : "pt-2"}`}
        >
            <h2 className="p-2 text-xl semibold bg-coolgray-800">{title}</h2>

            <div className="flex flex-col justify-center px-2 pt-2 space-x-0 space-y-2 sm:space-x-2 sm:flex-row sm:space-y-0">
                {children}
            </div>
        </div>
    );
}

type HeaderProps = Pick<LatestParseResponse["combatant"], "region" | "realm"> &
    Omit<Partial<LatestParseResponse["encounter"]>, "name"> &
    Partial<LatestParseResponse["meta"]> & {
        characterName: LatestParseResponse["combatant"]["name"];
        className?: LatestParseResponse["combatant"]["class"];
        encounterName?: LatestParseResponse["encounter"]["name"];
        spec?: LatestParseResponse["combatant"]["spec"];
    };

function Header({
    fightID,
    encounterName = "???",
    outOf,
    percentile,
    reportID,
    rank,
    realm,
    region,
    characterName,
    className,
    spec,
}: HeaderProps) {
    const classTextColor = className
        ? classTextColorMap[className.toLowerCase().split(" ").join("")]
        : "";

    return (
        <div className="flex flex-col items-center p-2 mt-4 rounded-tl rounded-tr sm:flex-row justify-evenly bg-coolgray-800">
            <div className="w-full sm:w-5/12">
                <h1
                    className={`text-3xl font-bold text-center uppercase sm:text-left ${classTextColor}`}
                >
                    <ExternalLink
                        href={`https://www.warcraftlogs.com/character/${region}/${realm}/${characterName}`.toLowerCase()}
                        className="inline-flex sm:flex"
                    >
                        {characterName}{" "}
                        <BiLinkExternal className="w-4 h-4 ml-2" />
                    </ExternalLink>
                </h1>
                <p className="text-center sm:text-left">
                    {capitalize(realm)} - {region.toUpperCase()}
                </p>

                {className && spec ? (
                    <p className="text-center sm:text-left">
                        {spec} {className}
                    </p>
                ) : null}
            </div>

            <div className="w-full text-center sm:w-2/12">vs</div>

            <div className="w-full text-center sm:w-5/12 sm:text-right">
                {fightID && reportID ? (
                    <ExternalLink
                        href={createWCLUrl({
                            reportID,
                            fightID,
                        })}
                        className="inline-flex justify-end text-2xl font-bold uppercase sm:flex"
                    >
                        {encounterName}
                        <BiLinkExternal className="w-4 h-4 ml-2" />
                    </ExternalLink>
                ) : (
                    <span className="inline-flex justify-end text-2xl font-bold uppercase sm:flex">
                        {encounterName}
                    </span>
                )}

                {percentile && rank && outOf ? (
                    <span
                        className={`${getTextRarityColor(
                            percentile
                        )} block sm:initial`}
                    >
                        parsing {percentile}% ({rank.toLocaleString()} /{" "}
                        {outOf.toLocaleString()})
                    </span>
                ) : null}
            </div>
        </div>
    );
}

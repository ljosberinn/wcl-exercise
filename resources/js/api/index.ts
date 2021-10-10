/* eslint-disable promise/prefer-await-to-then */
const API_BASE_URL = `/api/wcl`;

type CharacterInfo = {
    character: string;
    region: string;
    realm: string;
};

export type TopParseResponse = {
    meta: {
        fightID: number;
        reportID: string;
        startTime: number;
    };
    encounter: {
        name: string;
        outOf: number;
        rank: number;
        percentile: number;
    };
    combatant: {
        class: string;
        spec: string;
        server: string;
        itemLevel: number;
        talents: { icon: string; id: number; name: string }[];
        soulbindPowers: { icon: string; id: number; name: string }[];
        conduitPowers: { icon: string; id: number; name: string }[];
        legendaryEffects: { icon: string; id: number; name: string }[];
        gear: {
            icon: string;
            id: number;
            name: string;
            itemLevel: number;
            gems?: { id: number; itemLevel: number }[];
            bonusIDs?: number[];
            permanentEnchant?: number;
            temporaryEnchant?: number;
            onUseEnchant?: number;
        }[];
    };
};

export const getTopParse = ({
    character,
    region,
    realm,
}: CharacterInfo): Promise<TopParseResponse> => {
    return fetch(
        `${API_BASE_URL}/latest-parse/${region}/${realm}/${character}`
    ).then((response) => response.json());
};

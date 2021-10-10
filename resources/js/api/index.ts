const API_BASE_URL = `/api/wcl`;

type CharacterInfo = {
    character: string;
    region: string;
    realm: string;
};

export const getTopParse = ({
    character,
    region,
    realm,
}: CharacterInfo): Promise<unknown> => {
    return fetch(
        `${API_BASE_URL}/latest-parse/${region}/${realm}/${character}`
    ).then((response) => response.json());
};

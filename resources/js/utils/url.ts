type WCLUrlParams = {
    reportID: string;
    fightID: string | number;
    type?: "deaths";
    start?: number;
    end?: number;
};

export const createWCLUrl = ({
    reportID: report,
    fightID: fight,
    ...rest
}: WCLUrlParams): string => {
    // @ts-expect-error fixing later
    const params = new URLSearchParams({
        ...rest,
        translate: "true",
    }).toString();

    const url = `https://www.warcraftlogs.com/reports/${report}#fight=${fight}`;

    return `${url}&${params}`;
};

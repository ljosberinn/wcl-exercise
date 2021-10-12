export const classTextColorMap: Record<string, string> = {
    demonhunter: "text-demonhunter",
    warlock: "text-warlock",
    rogue: "text-rogue",
    warrior: "text-warrior",
    priest: "text-black dark:text-priest",
    hunter: "text-hunter",
    deathknight: "text-deathknight",
    shaman: "text-shaman",
    paladin: "text-paladin",
    monk: "text-monk",
    druid: "text-druid",
    mage: "text-mage",
};

export const getTextRarityColor = (percentile: number): string => {
    if (percentile > 90) {
        return qualityRarityColorMap.legendary;
    }

    if (percentile > 70) {
        return qualityRarityColorMap.epic;
    }

    if (percentile > 50) {
        return qualityRarityColorMap.rare;
    }

    if (percentile > 20) {
        return qualityRarityColorMap.uncommon;
    }

    return qualityRarityColorMap.common;
};

export const qualityRarityColorMap: Record<string, string> = {
    uncommon: "text-uncommon",
    common: "text-common",
    epic: "text-epic",
    legendary: "text-legendary",
    rare: "text-rare",
};

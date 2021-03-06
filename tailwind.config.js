const colors = require("tailwindcss/colors");

const classColors = {
    deathknight: "#c41e3a",
    demonhunter: "#a330c9",
    druid: "#ff7c0a",
    hunter: "#aad372",
    mage: "#3fc7eb",
    monk: "#00ff98",
    paladin: "#f48cba",
    priest: colors.white,
    rogue: "#fff648",
    shaman: "#0070dd",
    warlock: "#8788ee",
    warrior: "#c69b7d",
};

const parseColors = {
    legendary: "#ff8000",
    rare: "#0070ff",
    epic: "#a335ee",
    uncommon: "#1eff00",
    common: "#666",
};

module.exports = {
    mode: "jit",
    purge: ["./resources/**/*.{js,ts,jsx,tsx,php}"],
    theme: {
        fontFamily: {
            sans: ["Rubik"],
            mono: [
                "IBM Plex Mono",
                "ui-monospace",
                "SFMono-Regular",
                "monospace",
            ],
        },
        colors: {
            black: colors.black,
            blue: colors.blue,
            coolgray: colors.coolGray,
            current: "currentColor",
            gray: colors.warmGray,
            green: colors.emerald,
            red: colors.red,
            transparent: "transparent",
            white: colors.white,
            yellow: colors.yellow,
        },
        extend: {
            colors: {
                ...classColors,
                ...parseColors,
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
    darkMode: "class",
};

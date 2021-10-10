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
        extend: {
            colors: classColors,
        },
    },
    plugins: [],
    darkMode: "class",
};
module.exports = {
    TOKEN: process.env.TOKEN,

    ROLES: {
        OLHEIRO: process.env.OLHEIRO_ID,
        MEMBRO: process.env.MEMBRO_ID,
        ADMIN: process.env.ADMIN_ID,
    },

    CHANNELS: {
        WL_PANEL: process.env.SETUP_ID,
    },

    COLORS: {
        PRIMARY: 0x5865F2,
        SUCCESS: 0x57F287,
        ERROR: 0xED4245,
        WARNING: 0xFEE75C,
        INFO: 0x3498DB,
    },

    EMBED_FOOTER: "Rocinha RP • Sistema de Whitelist"
};

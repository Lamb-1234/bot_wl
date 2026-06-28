module.exports = {
    TOKEN: process.env.TOKEN,

    ROLES: {
        OLHEIRO: process.env.OLHEIRO_ID,
        MEMBRO: process.env.MEMBRO_ID,
        ADMIN: process.env.ADMIN_ID,
    },

    CHANNELS: {
        WL_PANEL: process.env.SETUP_ID,
        WL_REQUESTS: process.env.WL_REQUESTS_ID, // canal dos admins
        WL_LOGS: process.env.WL_LOGS_ID,
    },

    BUTTONS: {
        REQUEST_WL: "wl_request",
        ACCEPT: "wl_accept",
        REJECT: "wl_reject",
    },

    COLORS: {
        PRIMARY: 0x5865F2,
        SUCCESS: 0x57F287,
        ERROR: 0xED4245,
        WARNING: 0xFEE75C,
    },

    EMBED_FOOTER: "Rocinha RP • Whitelist System"
};

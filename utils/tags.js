const config = require("../config/config");

// hierarquia do maior pro menor
const tagHierarchy = [
    { role: config.ROLES.ADMIN, tag: "[A]" },
    { role: config.ROLES.RECRUTADOR, tag: "[R]" },
    { role: config.ROLES.MEMBRO, tag: "[M]" }
];

function getTagForMember(member) {
    if (!member) return "";

    const highest = tagHierarchy.find(t =>
        member.roles.cache.has(t.role)
    );

    if (!highest) return "";

    return highest.tag;
}

function formatNickname(member, wl = null) {
    if (!member) return null;

    const tag = getTagForMember(member);
    const name = wl?.nome || member.user.username;
    const id = wl?.id || "";

    // se não tiver WL (ex: OLHEIRO)
    if (!wl) return `${name}`;

    return `${tag} ${name} | ${id}`;
}

module.exports = {
    getTagForMember,
    formatNickname
};

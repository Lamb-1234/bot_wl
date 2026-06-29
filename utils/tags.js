const config = require("../config/config");

// Hierarquia (do maior para o menor)
const tagHierarchy = [
    { role: config.ROLES.ADMIN, tag: "[ADM]" },
    { role: config.ROLES.RECRUTADOR, tag: "[R]" },
    { role: config.ROLES.MEMBRO, tag: "[M]" }
];

function getTagForMember(member) {
    if (!member) return "";

    const role = tagHierarchy.find(r =>
        member.roles.cache.has(r.role)
    );

    return role ? role.tag : "";
}

function formatNickname(member, wl = null) {
    if (!member) return null;

    // Sem WL = nome padrão
    if (!wl) {
        return member.user.username;
    }

    const tag = getTagForMember(member);

    return `${tag ? tag + " " : ""}${wl.nome} | ${wl.id}`;
}

module.exports = {
    getTagForMember,
    formatNickname
};

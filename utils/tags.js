const config = require("../config/config");

// Hierarquia do maior para o menor
const tagHierarchy = [
    { role: config.ROLES.ADMIN, tag: "[A]" },
    { role: config.ROLES.RECRUTADOR, tag: "[R]" },
    { role: config.ROLES.MEMBRO, tag: "[M]" }
];

function getTagForMember(member) {
    if (!member) return "";

    console.log("========== TAG DEBUG ==========");

    console.log("Cargos do membro:");

    member.roles.cache.forEach(role => {
        console.log(`- ${role.name} (${role.id})`);
    });

    console.log("IDs do config:");
    console.log("ADMIN:", config.ROLES.ADMIN);
    console.log("RECRUTADOR:", config.ROLES.RECRUTADOR);
    console.log("MEMBRO:", config.ROLES.MEMBRO);

    const highest = tagHierarchy.find(t =>
        member.roles.cache.has(t.role)
    );

    console.log("Tag encontrada:", highest ? highest.tag : "NENHUMA");
    console.log("===============================");

    return highest ? highest.tag : "";
}

function formatNickname(member, wl = null) {
    if (!member) return null;

    // Sem WL = nome normal
    if (!wl) return member.user.username;

    const tag = getTagForMember(member);

    return `${tag ? tag + " " : ""}${wl.nome} | ${wl.id}`;
}

module.exports = {
    getTagForMember,
    formatNickname
};

const config = require("../config/config");
const { formatNickname } = require("./tags");

async function updateNickname(member, wl = null) {

    if (!member) return;

    const name = wl?.nome || member.user.username;
    const id = wl?.id || "";

    const tag = formatNickname(member, wl);

    let finalName = "";

    // SEM WL = OLHEIRO SIMPLES
    if (!wl || wl.status !== "approved") {
        finalName = `${name}`;
    } else {
        finalName = `${tag} ${name} | ${id}`;
    }

    if (finalName.length > 32) {
        finalName = finalName.slice(0, 32);
    }

    await member.setNickname(finalName).catch(() => {});
}

module.exports = {
    updateNickname
};

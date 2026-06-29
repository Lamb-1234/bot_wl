const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { formatNickname } = require("./tags");

async function applyUserState(member, client = null) {
    if (!member) return;

    const wl = wlStore.getWL(member.id);

    // =========================
    // SEM WL = OLHEIRO PADRÃO
    // =========================
    if (!wl || wl.status !== "approved") {

        await member.roles.add(config.ROLES.OLHEIRO).catch(console.error);
        await member.roles.remove(config.ROLES.MEMBRO).catch(console.error);

        await member.setNickname(member.user.username).catch(() => {});
        return;
    }

    // =========================
    // COM WL APROVADA = MEMBRO
    // =========================
    await member.roles.add(config.ROLES.MEMBRO).catch(() => {});
    await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});

    await member.setNickname(formatNickname(member, wl)).catch(() => {});
}

module.exports = {
    applyUserState
};

const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { sendLog } = require("./logger");
const { setNickname } = require("./nickname");

// =========================
// APPROVE WL
// =========================
async function approveWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl || wl.status !== "pending") return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    // atualiza status
    wlStore.updateWL(userId, {
        status: "approved"
    });

    // nickname
    await setNickname(member, wl.nome, wl.id).catch(() => {});

    // cargos (REGRA PERFEITA)
    await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});
    await member.roles.add(config.ROLES.MEMBRO).catch(() => {});

    // log
    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: "WL APROVADA",
        staff: interaction.user.tag
    });

    // DM
    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
        user.send("🌴 Sua whitelist foi APROVADA! Bem-vindo ao servidor.").catch(() => {});
    }

    return true;
}

// =========================
// REJECT WL
// =========================
async function rejectWL(client, interaction, userId, reason = "Não informado") {

    const wl = wlStore.getWL(userId);
    if (!wl || wl.status !== "pending") return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    wlStore.updateWL(userId, {
        status: "rejected",
        reason
    });

    // log
    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: `WL REJEITADA (${reason})`,
        staff: interaction.user.tag
    });

    // DM
    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
        user.send(`❌ Sua whitelist foi REJEITADA.\nMotivo: **${reason}**`).catch(() => {});
    }

    return true;
}

// =========================
// REMOVE WL (ADMIN)
// =========================
async function removeWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    // remove do banco
    wlStore.deleteWL(userId);

    // remove cargo membro se existir
    if (member) {
        await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
        await member.roles.add(config.ROLES.OLHEIRO).catch(() => {});
    }

    // log
    await sendLog(client, {
        userTag: member ? member.user.tag : "Desconhecido",
        userId,
        action: "WL REMOVIDA",
        staff: interaction.user.tag
    });

    return true;
}

module.exports = {
    approveWL,
    rejectWL,
    removeWL
};

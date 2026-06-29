const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { sendLog } = require("./logger");
const { setNickname } = require("./nickname");

// =========================
// APROVAR WL
// =========================
async function approveWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl || wl.status !== "pending") return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    // Atualiza status
    wlStore.updateWL(userId, {
        status: "approved"
    });

    // Nickname
    await setNickname(member, wl.nome, wl.id).catch(() => {});

    // Cargos
    await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});
    await member.roles.add(config.ROLES.MEMBRO).catch(() => {});

    // Log
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
// REJEITAR WL
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

    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: `WL REJEITADA (${reason})`,
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);

    if (user) {
        user.send(
            `❌ Sua whitelist foi REJEITADA.\n\nMotivo: **${reason}**`
        ).catch(() => {});
    }

    return true;
}

// =========================
// REMOVER WL
// =========================
async function removeWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    // Remove do banco
    wlStore.deleteWL(userId);

    if (member) {

        // Remove cargos de membro
        await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
        await member.roles.remove(config.ROLES.RECRUTADOR).catch(() => {});

        // Devolve cargo de Olheiro
        await member.roles.add(config.ROLES.OLHEIRO).catch(() => {});
    }

    await sendLog(client, {
        userTag: member ? member.user.tag : "Desconhecido",
        userId,
        action: "WL REMOVIDA",
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);

    if (user) {
        user.send("⚠ Sua whitelist foi removida por um administrador.").catch(() => {});
    }

    return true;
}

module.exports = {
    approveWL,
    rejectWL,
    removeWL
};

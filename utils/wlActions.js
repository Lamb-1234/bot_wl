const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { setNickname } = require("./nickname");
const { sendLog } = require("./logger");

async function approveWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    await setNickname(member, wl.nome, wl.id);

    await member.roles.add(config.ROLES.MEMBRO).catch(() => {});
    await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});

    wlStore.updateWL(userId, { status: "approved" });

    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: "WL APROVADA",
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
        user.send("✔ Sua whitelist foi APROVADA!").catch(() => {});
    }

    return true;
}

async function rejectWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    wlStore.updateWL(userId, { status: "rejected" });

    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: "WL REJEITADA",
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
        user.send("❌ Sua whitelist foi REJEITADA.").catch(() => {});
    }

    return true;
}

async function removeWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    wlStore.deleteWL(userId);

    if (member) {
        await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
        await member.roles.remove(config.ROLES.RECRUTADOR).catch(() => {});
    }

    await sendLog(client, {
        userTag: member?.user.tag || "Desconhecido",
        userId,
        action: "WL REMOVIDA",
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
        user.send("⚠ Sua whitelist foi REMOVIDA por um administrador.").catch(() => {});
    }

    return true;
}

async function checkWL(userId) {
    return wlStore.getWL(userId);
}

module.exports = {
    approveWL,
    rejectWL,
    removeWL,
    checkWL
};

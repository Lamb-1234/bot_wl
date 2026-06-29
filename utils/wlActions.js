const { EmbedBuilder } = require("discord.js");
const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { sendLog } = require("./logger");
const { formatNickname } = require("./tags");

// =========================
// HELPERS
// =========================

async function getMember(guild, userId) {
    return guild.members.fetch(userId).catch(() => null);
}

async function getUser(client, userId) {
    return client.users.fetch(userId).catch(() => null);
}

// =========================
// APPROVE WL
// =========================
async function approveWL(client, interaction, userId) {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await getMember(interaction.guild, userId);
    if (!member) return false;

    // Primeiro altera os cargos
    await member.roles.add(config.ROLES.MEMBRO).catch(() => {});
    await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});

    // Atualiza o cache do membro
    await member.fetch();

    // Agora aplica o nickname já com a tag correta
    await member.setNickname(formatNickname(member, wl)).catch(() => {});

    wlStore.updateWL(userId, { status: "approved" });

    await sendLog(client, {
        userTag: member.user.tag,
        userId,
        action: "WL APROVADA",
        staff: interaction.user.tag
    });

    const user = await getUser(client, userId);

    if (user) {
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.COLORS.SUCCESS)
                    .setTitle("✅ Whitelist Aprovada")
                    .setDescription("Parabéns! Sua whitelist foi aprovada.")
                    .addFields({
                        name: "🎉 Status",
                        value: "Você já pode jogar no servidor."
                    })
                    .setFooter({ text: config.EMBED_FOOTER })
                    .setTimestamp()
            ]
        }).catch(() => {});
    }

    return true;
}

// =========================
// REJECT WL
// =========================
async function rejectWL(client, interaction, userId, reason = "Não informado") {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await getMember(interaction.guild, userId);

    wlStore.deleteWL(userId);

    await sendLog(client, {
        userTag: member?.user.tag || "Desconhecido",
        userId,
        action: `WL REJEITADA (${reason})`,
        staff: interaction.user.tag
    });

    const user = await getUser(client, userId);

    if (user) {
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.COLORS.ERROR)
                    .setTitle("❌ Whitelist Rejeitada")
                    .setDescription("Sua solicitação foi rejeitada.")
                    .addFields(
                        { name: "📝 Motivo", value: reason },
                        { name: "ℹ️ Aviso", value: "Você pode corrigir e enviar novamente." }
                    )
                    .setFooter({ text: config.EMBED_FOOTER })
                    .setTimestamp()
            ]
        }).catch(() => {});
    }

    return true;
}

// =========================
// REMOVE WL
// =========================
async function removeWL(client, interaction, userId, reason = "Não informado") {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await getMember(interaction.guild, userId);

    wlStore.deleteWL(userId);

    if (member) {
        await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
        await member.roles.add(config.ROLES.OLHEIRO).catch(() => {});
        await member.setNickname(member.user.username).catch(() => {});
    }

    await sendLog(client, {
        userTag: member?.user.tag || "Desconhecido",
        userId,
        action: `WL REMOVIDA (${reason})`,
        staff: interaction.user.tag
    });

    const user = await getUser(client, userId);

    if (user) {
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.COLORS.WARNING)
                    .setTitle("⚠️ Whitelist Removida")
                    .setDescription("Sua whitelist foi removida pela equipe.")
                    .addFields(
                        { name: "📝 Motivo", value: reason },
                        { name: "ℹ️ Aviso", value: "Fale com a staff se necessário." }
                    )
                    .setFooter({ text: config.EMBED_FOOTER })
                    .setTimestamp()
            ]
        }).catch(() => {});
    }

    return true;
}

// =========================
// CHECK WL
// =========================
function checkWL(userId) {
    return wlStore.getWL(userId);
}

module.exports = {
    approveWL,
    rejectWL,
    removeWL,
    checkWL
};

const { EmbedBuilder } = require("discord.js");
const wlStore = require("../data/wlStore");
const config = require("../config/config");
const { setNickname } = require("./nickname");
const { sendLog } = require("./logger");

// =========================
// APPROVE WL
// =========================
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
        const embed = new EmbedBuilder()
            .setColor(config.COLORS.SUCCESS)
            .setTitle("✅ Whitelist Aprovada")
            .setDescription("Parabéns! Sua whitelist foi aprovada.")
            .addFields({
                name: "🎉 Status",
                value: "Você já pode jogar no servidor."
            })
            .setFooter({ text: config.EMBED_FOOTER })
            .setTimestamp();

        user.send({ embeds: [embed] }).catch(() => {});
    }

    return true;
}

// =========================
// REJECT WL
// =========================
async function rejectWL(client, interaction, userId, reason = "Não informado") {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    wlStore.deleteWL(userId);

    await sendLog(client, {
        userTag: member ? member.user.tag : "Desconhecido",
        userId,
        action: "WL REJEITADA",
        reason,
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);

    if (user) {
        const embed = new EmbedBuilder()
            .setColor(config.COLORS.ERROR)
            .setTitle("❌ Whitelist Rejeitada")
            .setDescription("Sua solicitação foi rejeitada.")
            .addFields(
                { name: "📝 Motivo", value: reason },
                { name: "ℹ️ Aviso", value: "Você pode corrigir e enviar novamente." }
            )
            .setFooter({ text: config.EMBED_FOOTER })
            .setTimestamp();

        user.send({ embeds: [embed] }).catch(() => {});
    }

    return true;
}

// =========================
// REMOVE WL
// =========================
async function removeWL(client, interaction, userId, reason = "Não informado") {

    const wl = wlStore.getWL(userId);
    if (!wl) return false;

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    wlStore.deleteWL(userId);

    if (member) {
        await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
        await member.roles.add(config.ROLES.OLHEIRO).catch(() => {});
        
         // 🔥 RESETA O NICKNAME
        await member.setNickname(member.user.username).catch(() => {});
    }

    await sendLog(client, {
        userTag: member?.user.tag || "Desconhecido",
        userId,
        action: "WL REMOVIDA",
        reason,
        staff: interaction.user.tag
    });

    const user = await client.users.fetch(userId).catch(() => null);

    if (user) {
        const embed = new EmbedBuilder()
            .setColor(config.COLORS.WARNING)
            .setTitle("⚠️ Whitelist Removida")
            .setDescription("Sua whitelist foi removida pela equipe.")
            .addFields(
                { name: "📝 Motivo", value: reason },
                { name: "ℹ️ Aviso", value: "Fale com a staff se necessário." }
            )
            .setFooter({ text: config.EMBED_FOOTER })
            .setTimestamp();

        user.send({ embeds: [embed] }).catch(() => {});
    }

    return true;
}

// =========================
// CHECK WL
// =========================
async function checkWL(userId) {
    return wlStore.getWL(userId);
}

module.exports = {
    approveWL,
    rejectWL,
    removeWL,
    checkWL
};

const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");

async function sendLog(client, data) {

    const channel = await client.channels.fetch(config.CHANNELS.WL_LOGS).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle("📋 LOG DE WHITELIST")
        .setColor(config.COLORS.PRIMARY)
        .addFields(
            {
                name: "👤 Usuário",
                value: data.userTag || "Desconhecido",
                inline: true
            },
            {
                name: "🆔 ID Discord",
                value: data.userId || "Desconhecido",
                inline: true
            },
            {
                name: "👮 Moderador",
                value: data.staff || "Sistema",
                inline: true
            },
            {
                name: "📌 Ação",
                value: data.action,
                inline: false
            }
        );

    // Adiciona motivo somente se existir
    if (data.reason) {
        embed.addFields({
            name: "📝 Motivo",
            value: data.reason,
            inline: false
        });
    }

    embed
        .setTimestamp()
        .setFooter({
            text: config.EMBED_FOOTER
        });

    await channel.send({
        embeds: [embed]
    });
}

module.exports = {
    sendLog
};

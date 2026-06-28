const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");

async function sendLog(client, data) {

    const channel = await client.channels.fetch(config.CHANNELS.WL_LOGS).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle("📊 LOG WHITELIST")
        .setColor(0x2B2D31)
        .addFields(
            { name: "👤 Usuário", value: data.userTag },
            { name: "🆔 ID", value: data.userId },
            { name: "📌 Ação", value: data.action },
            { name: "👮 Moderador", value: data.staff },
            { name: "⏰ Data", value: new Date().toLocaleString("pt-BR") }
        );

    channel.send({ embeds: [embed] });
}

module.exports = { sendLog };

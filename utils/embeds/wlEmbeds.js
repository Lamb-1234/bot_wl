const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

function createPendingEmbed(nome, id, discordTag) {

    return new EmbedBuilder()
        .setTitle("📋 NOVA WHITELIST")
        .setColor(config.COLORS.WARNING)
        .addFields(
            {
                name: "👤 Nome RP",
                value: nome
            },
            {
                name: "🆔 ID",
                value: id
            },
            {
                name: "👤 Discord",
                value: discordTag
            },
            {
                name: "📊 Status",
                value: "🟡 PENDENTE"
            }
        )
        .setTimestamp();

}

function updateStatus(embed, status, moderator) {

    const fields = [...embed.data.fields];

    const statusIndex = fields.findIndex(
        field => field.name.includes("Status")
    );

    if (statusIndex !== -1) {

        fields[statusIndex] = {
            name: "📊 Status",
            value: status
        };

    } else {

        fields.push({
            name: "📊 Status",
            value: status
        });

    }

    return EmbedBuilder.from(embed)
        .setFields(fields)
        .setFooter({
            text: `Finalizado por ${moderator}`
        });

}

module.exports = {
    createPendingEmbed,
    updateStatus
};

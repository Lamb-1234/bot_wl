const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config/config");

module.exports = async function updateStaffMessage(interaction, approved) {

    const message = interaction.message;

    if (!message?.embeds?.length) return;

    const embed = EmbedBuilder.from(message.embeds[0]);

    embed.setColor(
        approved
            ? config.COLORS.SUCCESS
            : config.COLORS.ERROR
    );

    embed.addFields({
        name: "📋 Resultado",
        value: approved
            ? `✅ Aprovada por ${interaction.user.tag}`
            : `❌ Rejeitada por ${interaction.user.tag}`
    });

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("disabled_accept")
            .setLabel(
                approved
                    ? "✔ Aprovada"
                    : "✔ Aprovar"
            )
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId("disabled_reject")
            .setLabel(
                approved
                    ? "❌ Rejeitar"
                    : "❌ Rejeitada"
            )
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)

    );

    await message.edit({
        embeds: [embed],
        components: [row]
    });

};

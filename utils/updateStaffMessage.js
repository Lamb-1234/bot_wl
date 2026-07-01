const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { updateStatus } = require("./embeds/wlEmbed");

module.exports = async function updateStaffMessage(
    interaction,
    approved
) {

    const message = interaction.message;

    const embed = updateStatus(
        message.embeds[0],
        approved
            ? `🟢 APROVADA por ${interaction.user.tag}`
            : `🔴 REJEITADA por ${interaction.user.tag}`,
        interaction.user.tag
    );

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

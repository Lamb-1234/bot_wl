const { SlashCommandBuilder } = require("discord.js");
const { removeWL } = require("../../utils/wlActions");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewl")
        .setDescription("Remove a whitelist de um usuário")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Você não tem permissão para usar este comando.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        const success = await removeWL(client, interaction, user.id);

        if (!success) {
            return interaction.reply({
                content: "⚠ Esse usuário não possui uma whitelist cadastrada.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: `✅ A whitelist de **${user.tag}** foi removida com sucesso.`,
            ephemeral: true
        });
    }
};

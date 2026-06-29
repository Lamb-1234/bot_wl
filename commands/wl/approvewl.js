const { SlashCommandBuilder } = require("discord.js");
const { approveWL } = require("../../utils/wlActions");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("approvewl")
        .setDescription("Aprova a whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Sem permissão",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        const success = await approveWL(client, interaction, user.id);

        if (!success) {
            return interaction.reply({
                content: "⚠ WL não encontrada ou erro ao aprovar.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: `✔ WL de ${user.tag} aprovada com sucesso.`,
            ephemeral: true
        });

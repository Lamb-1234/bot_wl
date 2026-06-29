const { SlashCommandBuilder } = require("discord.js");
const { rejectWL } = require("../../utils/wlActions");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rejectwl")
        .setDescription("Rejeita a whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("reason")
                .setDescription("Motivo da rejeição")
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
        const reason = interaction.options.getString("reason");

        const success = await rejectWL(client, user.id, reason);

        if (!success) {
            return interaction.reply({
                content: "⚠ WL não encontrada ou erro ao rejeitar.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: `❌ WL de ${user.tag} rejeitada com sucesso.\n📌 Motivo: ${reason}`,
            ephemeral: true
        });
    }
};

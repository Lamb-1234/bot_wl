const { SlashCommandBuilder } = require("discord.js");
const { removeWL } = require("../../utils/wlActions");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewl")
        .setDescription("Remove a whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("motivo")
                .setDescription("Motivo da remoção")
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
        const reason = interaction.options.getString("motivo");

        const success = await removeWL(client, interaction, user.id, reason);

        if (!success) {
            return interaction.reply({
                content: "⚠ WL não encontrada ou erro ao remover.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: `⚠ WL de ${user.tag} removida com sucesso.\n📝 Motivo: ${reason}`,
            ephemeral: true
        });
    }
};

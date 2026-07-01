const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { createOrUpdatePanel } = require("../../utils/panelManager");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("painel")
        .setDescription("Atualiza ou recria o painel da whitelist.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        try {

            await createOrUpdatePanel(interaction.client);

            await interaction.editReply({
                content: "✅ Painel sincronizado com sucesso."
            });

        } catch (error) {

            console.error(error);

            await interaction.editReply({
                content: "❌ Não foi possível sincronizar o painel."
            });

        }

    }

};

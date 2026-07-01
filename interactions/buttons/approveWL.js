const wlStore = require("../../data/wlStore");
const config = require("../../config/config");

const {
    approveWL: approveAction
} = require("../../utils/wlActions");

const updateStaffMessage = require("../../utils/updateStaffMessage");

module.exports = async (interaction, client) => {

    const userId = interaction.customId.split(":")[1];

    const wl = wlStore.getWL(userId);

    if (!wl || wl.status !== "pending") {
        return interaction.reply({
            content: "⚠ Essa whitelist já foi finalizada.",
            ephemeral: true
        });
    }

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        return interaction.reply({
            content: "Usuário não encontrado.",
            ephemeral: true
        });
    }

    const success = await approveAction(client, interaction, userId);

    if (!success) {
        return interaction.reply({
            content: "❌ Erro ao aprovar a whitelist.",
            ephemeral: true
        });
    }

    await updateStaffMessage(interaction, true);

    return interaction.reply({
        content: "✔ Whitelist APROVADA!",
        ephemeral: true
    });

};

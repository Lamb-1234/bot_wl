const config = require("../config/config");

const handleRequestButton = require("./buttons/requestWL");
const handleWhitelistModal = require("./modals/whitelistModal");
const handleApproveButton = require("./buttons/approveWL");
const handleRejectButton = require("./buttons/rejectWL");

const { canHandleWL } = require("../utils/permissions");

module.exports = async (interaction, client) => {

    // Botão solicitar WL
    if (
        interaction.isButton() &&
        interaction.customId === config.BUTTONS.REQUEST_WL
    ) {
        return handleRequestButton(interaction);
    }

    // Modal
    if (
        interaction.isModalSubmit() &&
        interaction.customId === "wl_modal"
    ) {
        return handleWhitelistModal(interaction);
    }

    // Botões da staff
    if (interaction.isButton()) {

        const [action] = interaction.customId.split(":");

        if (
            action !== config.BUTTONS.ACCEPT &&
            action !== config.BUTTONS.REJECT
        ) return;

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Você não possui permissão.",
                ephemeral: true
            });
        }

        if (action === config.BUTTONS.ACCEPT) {
            return handleApproveButton(interaction, client);
        }

        if (action === config.BUTTONS.REJECT) {
            return handleRejectButton(interaction, client);
        }
    }

};

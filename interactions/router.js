module.exports = async (interaction, client) => {

    console.log(
        "Interaction:",
        interaction.isButton(),
        interaction.isModalSubmit(),
        interaction.customId
    );

    try {

        // Botão solicitar WL
        if (
            interaction.isButton() &&
            interaction.customId === config.BUTTONS.REQUEST_WL
        )  {
    console.log("Entrou no botão WL");
    return handleRequestButton(interaction);
        }
        // Modal
        if (
            interaction.isModalSubmit() &&
            interaction.customId === "wl_modal"
        ) {
            return handleWhitelistModal(interaction);
        }

        // Staff
        if (interaction.isButton()) {

            const [action] = interaction.customId.split(":");

            if (
                action !== config.BUTTONS.ACCEPT &&
                action !== config.BUTTONS.REJECT
            ) {
                return;
            }

            if (!canHandleWL(interaction.member)) {

                return interaction.reply({
                    content: "❌ Você não possui permissão.",
                    ephemeral: true
                });

            }

            if (action === config.BUTTONS.ACCEPT) {
                return handleApproveButton(interaction, client);
            }

            return handleRejectButton(interaction, client);

        }

    } catch (error) {

        console.error(error);

        if (!interaction.replied && !interaction.deferred) {

            return interaction.reply({
                content: "❌ Ocorreu um erro inesperado.",
                ephemeral: true
            });

        }

    }

};

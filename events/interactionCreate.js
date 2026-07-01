module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction, client);

            } catch (error) {

                console.error(error);

                if (!interaction.replied && !interaction.deferred) {

                    await interaction.reply({
                        content: "❌ Erro ao executar o comando.",
                        ephemeral: true
                    });

                }

            }

            return;
        }

        // Router
        return require("../interactions/router")(interaction, client);

    }

};

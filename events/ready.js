const loadCommands = require("../handlers/commandHandler");
const { createOrUpdatePanel } = require("../utils/panelManager");

module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {

        try {

            await loadCommands(client);

            console.log(`🤖 Bot online: ${client.user.tag}`);

            await createOrUpdatePanel(client);

            console.log("✅ Painel da WL sincronizado.");

        } catch (error) {

            console.error("Erro no ready:", error);

        }

    }
};

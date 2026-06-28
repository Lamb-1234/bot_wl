const whitelist = require("../handlers/whitelist");

module.exports = {

    name: "interactionCreate",

    async execute(interaction) {

        if (interaction.isButton()) {
            return whitelist.button(interaction);
        }

        if (interaction.isModalSubmit()) {
            return whitelist.modal(interaction);
        }

    }

};

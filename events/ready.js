const whitelist = require("../handlers/whitelist");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {
        console.log(`Bot online: ${client.user.tag}`);

        whitelist.sendPanel(client);
    }
};

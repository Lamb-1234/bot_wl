const fs = require("fs");
const path = require("path");

module.exports = async (client) => {

    client.commands = new Map();

    const commands = [];

    const commandsPath = path.join(__dirname, "../commands");

    function loadCommands(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {

            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                loadCommands(filePath);
                continue;
            }

            if (!file.endsWith(".js")) continue;

            const command = require(filePath);

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    loadCommands(commandsPath);

    await client.application.commands.set(commands);

    console.log(`${commands.length} comandos registrados.`);
};

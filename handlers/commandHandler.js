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

            // pasta
            if (stat.isDirectory()) {
                loadCommands(filePath);
                continue;
            }

            // só JS
            if (!file.endsWith(".js")) continue;

            try {
                const command = require(filePath);

                // =========================
                // VALIDAÇÃO ANTI-CRASH
                // =========================
                if (!command) {
                    console.log(`[CMD SKIP] ${file} vazio`);
                    continue;
                }

                if (!command.data || !command.data.name) {
                    console.log(`[CMD SKIP] ${file} sem data/name`);
                    continue;
                }

                if (!command.execute) {
                    console.log(`[CMD SKIP] ${file} sem execute`);
                    continue;
                }

                // registra no bot
                client.commands.set(command.data.name, command);

                // registra no Discord
                commands.push(command.data.toJSON());

                console.log(`[CMD OK] ${command.data.name}`);

            } catch (err) {
                console.log(`[CMD ERROR] ${file}`);
                console.log(err);
                continue; // NÃO derruba o bot
            }
        }
    }

    loadCommands(commandsPath);

    try {
        await client.application.commands.set(commands);
        console.log(`${commands.length} comandos registrados no Discord.`);
    } catch (err) {
        console.log("Erro ao registrar comandos no Discord:");
        console.log(err);
    }
};

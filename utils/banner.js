const chalk = require("chalk");
const config = require("../config/config");

function showBanner(client) {

    console.clear();

    console.log(chalk.cyan(`
██╗    ██╗██╗         ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
██║    ██║██║         ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝
██║ █╗ ██║██║         █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗
██║███╗██║██║         ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝
╚███╔███╔╝███████╗    ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗
 ╚══╝╚══╝ ╚══════╝    ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
`));

    console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.white(` Versão      : ${config.VERSION}`));
    console.log(chalk.white(` Bot         : ${client.user.tag}`));
    console.log(chalk.white(` Servidores  : ${client.guilds.cache.size}`));
    console.log(chalk.white(` Ping        : ${client.ws.ping} ms`));
    console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
}

module.exports = {
    showBanner
};

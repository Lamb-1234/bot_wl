const { SlashCommandBuilder } = require("discord.js");
const wlStore = require("../../data/wlStore");
const { isAdmin } = require("../../utils/adminOnly");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkwl")
        .setDescription("Verifica status da whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!isAdmin(interaction.member)) {
            return interaction.reply({
                content: "❌ Sem permissão.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");
        const wl = await wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply("⚠ Usuário não possui WL.");
        }

        return interaction.reply({
            content:
`📋 WL INFO

👤 User: ${user.tag}
🆔 ID: ${wl.idJogador}
📌 Status: ${wl.status}`,
            ephemeral: true
        });
    }
};

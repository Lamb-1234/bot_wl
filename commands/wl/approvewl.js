const { SlashCommandBuilder } = require("discord.js");
const wlStore = require("../../data/wlStore");
const { isAdmin } = require("../../utils/adminOnly");
const config = require("../../config/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("approvewl")
        .setDescription("Aprova uma whitelist manualmente")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!isAdmin(interaction.member)) {
            return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
        }

        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const wl = await wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply("⚠ WL não encontrada.");
        }

        wlStore.updateStatus(user.id, "approved");

        if (member) {
            await member.roles.add(config.ROLES.MEMBRO).catch(() => {});
            await member.roles.remove(config.ROLES.OLHEIRO).catch(() => {});
        }

        user.send("✔ Sua WL foi aprovada manualmente.").catch(() => {});

        return interaction.reply(`✔ WL de ${user.tag} aprovada.`);
    }
};

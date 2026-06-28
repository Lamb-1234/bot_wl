const { SlashCommandBuilder } = require("discord.js");
const wlStore = require("../data/wlStore");
const config = require("../config/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewl")
        .setDescription("Remove a whitelist de um usuário (APENAS ADMIN)")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário para remover WL")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        // 🔒 permissão admin
        const isAdmin = interaction.member.roles.cache.has(config.ROLES.ADMIN);

        if (!isAdmin) {
            return interaction.reply({
                content: "❌ Apenas admins podem remover whitelist.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        if (!user) {
            return interaction.reply({
                content: "❌ Usuário inválido.",
                ephemeral: true
            });
        }

        // buscar WL
        const wl = await wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "⚠ Esse usuário não tem whitelist.",
                ephemeral: true
            });
        }

        // remover (mudar status)
        wlStore.updateStatus(user.id, "removed");

        // remover cargo se quiser
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (member) {
            await member.roles.remove(config.ROLES.MEMBRO).catch(() => {});
            await member.roles.add(config.ROLES.OLHEIRO).catch(() => {});
        }

        // DM pro usuário
        user.send("🗑 Sua whitelist foi removida por um administrador.").catch(() => {});

        return interaction.reply({
            content: `✔ WL de ${user.tag} foi removida.`,
            ephemeral: true
        });
    }
};

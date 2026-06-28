const wlStore = require("../data/wlStore");
const config = require("../config/config");

module.exports = {
    name: "removewl",
    description: "Remove a whitelist de um usuário (apenas admins)",
    options: [
        {
            name: "user",
            description: "Usuário para remover WL",
            type: 6,
            required: true
        }
    ],

    async execute(interaction) {

        // 🔥 PERMISSÃO ADMIN
        const member = interaction.member;

        const isAdmin =
            member.permissions.has("Administrator") ||
            member.roles.cache.some(r => r.id === config.ROLES.ADMIN);

        if (!isAdmin) {
            return interaction.reply({
                content: "❌ Apenas administradores podem usar este comando.",
                flags: 64
            });
        }

        const user = interaction.options.getUser("user");

        const wl = wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "❌ Esse usuário não tem whitelist.",
                flags: 64
            });
        }

        wlStore.deleteWL(user.id);

        return interaction.reply({
            content: `✔ WL de **${user.tag}** foi removida com sucesso.`,
            flags: 64
        });
    }
};

const wlStore = require("../data/wlStore");
const config = require("../config/config");

module.exports = {
    name: "removewl",
    description: "Remove a whitelist de um usuário (Admin only)",
    options: [
        {
            name: "user",
            description: "Usuário",
            type: 6,
            required: true
        },
        {
            name: "motivo",
            description: "Motivo da remoção",
            type: 3,
            required: true
        }
    ],

    async execute(interaction, client) {

        const member = interaction.member;

        // =========================
        // PERMISSÃO ADMIN
        // =========================
        const isAdmin =
            member.permissions.has("Administrator") ||
            member.roles.cache.has(config.ROLES.ADMIN);

        if (!isAdmin) {
            return interaction.reply({
                content: "❌ Apenas administradores podem usar este comando.",
                flags: 64
            });
        }

        const user = interaction.options.getUser("user");
        const motivo = interaction.options.getString("motivo");

        const wl = wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "❌ Esse usuário não possui whitelist.",
                flags: 64
            });
        }

        // =========================
        // REMOVE WL
        // =========================
        wlStore.deleteWL(user.id);

        // =========================
        // DM PRO USUÁRIO
        // =========================
        user.send(
            `❌ Sua whitelist foi REMOVIDA.\n📌 Motivo: **${motivo}**`
        ).catch(() => {});

        // =========================
        // LOG NO CANAL
        // =========================
        const logChannel = await client.channels.fetch(config.CHANNELS.WL_LOGS).catch(() => null);

        if (logChannel) {
            logChannel.send({
                embeds: [
                    {
                        title: "🧾 WL REMOVIDA",
                        color: config.COLORS.ERROR,
                        fields: [
                            { name: "👤 Usuário", value: `${user.tag} (${user.id})` },
                            { name: "🛠️ Removido por", value: `${interaction.user.tag}` },
                            { name: "📌 Motivo", value: motivo }
                        ],
                        timestamp: new Date()
                    }
                ]
            });
        }

        // =========================
        // RESPOSTA
        // =========================
        return interaction.reply({
            content: `✔ WL de **${user.tag}** removida com sucesso.`,
            flags: 64
        });
    }
};

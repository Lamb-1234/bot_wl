const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../config/config");
const { getEngineStats } = require("../../utils/engineStats");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("engine")
        .setDescription("Mostra informações da WL Engine"),

    async execute(interaction, client) {

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Sem permissão.",
                ephemeral: true
            });
        }

        const stats = getEngineStats();

        const embed = new EmbedBuilder()
            .setColor(config.COLORS.PRIMARY)
            .setTitle("⚙️ WL Engine")
            .setDescription(`**Versão:** v${config.VERSION}`)
            .addFields(

                {
                    name: "📊 Estatísticas",
                    value:
                        `**Total:** ${stats.total}\n` +
                        `🟡 Pendentes: ${stats.pending}\n` +
                        `🟢 Aprovadas: ${stats.approved}\n` +
                        `🔴 Rejeitadas: ${stats.rejected}`
                },

                {
                    name: "🤖 Bot",
                    value:
                        `Ping: ${client.ws.ping}ms\n` +
                        `Servidores: ${client.guilds.cache.size}\n` +
                        `Usuários: ${client.users.cache.size}`
                },

                {
                    name: "🟢 Status",
                    value: "Online"
                }

            )
            .setFooter({
                text: config.EMBED_FOOTER
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};

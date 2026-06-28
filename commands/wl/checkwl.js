const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { checkWL } = require("../../utils/wlActions");
const { canHandleWL } = require("../../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkwl")
        .setDescription("Verifica a whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Sem permissão",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        const wl = await checkWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "⚠ WL não encontrada.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("📋 STATUS DA WHITELIST")
            .setColor(0x2B2D31)
            .addFields(
                { name: "👤 Usuário", value: user.tag },
                { name: "🆔 ID RP", value: wl.id || "N/A" },
                { name: "📛 Nome RP", value: wl.nome || "N/A" },
                { name: "📊 Status", value: wl.status || "pending" },
                { name: "📅 Criado em", value: `<t:${Math.floor(wl.createdAt / 1000)}:R>` }
            );

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

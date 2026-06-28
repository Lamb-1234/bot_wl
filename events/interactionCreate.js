const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config/config");
const { validateName, validateId } = require("../utils/validators");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // =========================
        // BOTÃO - ABRIR WL
        // =========================
        if (interaction.isButton() && interaction.customId === config.BUTTONS.REQUEST_WL) {

            const modal = new ModalBuilder()
                .setCustomId("wl_modal")
                .setTitle("Whitelist - Rocinha RP");

            const nome = new TextInputBuilder()
                .setCustomId("nome")
                .setLabel("Nome RP (Nome + Sobrenome)")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const id = new TextInputBuilder()
                .setCustomId("id")
                .setLabel("ID do jogador")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(nome),
                new ActionRowBuilder().addComponents(id)
            );

            return interaction.showModal(modal);
        }

        // =========================
        // SUBMIT MODAL
        // =========================
        if (interaction.isModalSubmit() && interaction.customId === "wl_modal") {

            const nome = interaction.fields.getTextInputValue("nome");
            const id = interaction.fields.getTextInputValue("id");

            const errorName = validateName(nome);
            const errorId = validateId(id);

            if (errorName) {
                return interaction.reply({ content: errorName, ephemeral: true });
            }

            if (errorId) {
                return interaction.reply({ content: errorId, ephemeral: true });
            }

            const channel = await interaction.guild.channels.fetch(config.CHANNELS.WL_REQUESTS);

            const embed = new EmbedBuilder()
                .setTitle("📋 NOVA WHITELIST")
                .setColor(config.COLORS.WARNING)
                .addFields(
                    { name: "👤 Nome RP", value: nome },
                    { name: "🆔 ID", value: id },
                    { name: "👤 Discord", value: `${interaction.user.tag}` },
                    { name: "📊 Status", value: "🟡 PENDENTE" }
                );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`${config.BUTTONS.ACCEPT}:${interaction.user.id}`)
                    .setLabel("✔ Aprovar")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId(`${config.BUTTONS.REJECT}:${interaction.user.id}`)
                    .setLabel("❌ Rejeitar")
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({ embeds: [embed], components: [row] });

            return interaction.reply({
                content: "✅ Sua whitelist foi enviada!",
                ephemeral: true
            });
        }

        // =========================
        // APROVAR / REJEITAR
        // =========================
        if (interaction.isButton()) {

            const [action, userId] = interaction.customId.split(":");

            if (!action || !userId) return;

            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (!member) return interaction.reply({ content: "Usuário não encontrado.", ephemeral: true });

            // APROVAR
            if (action === config.BUTTONS.ACCEPT) {

                await member.roles.add(config.ROLES.MEMBRO);
                await member.roles.remove(config.ROLES.OLHEIRO);

                return interaction.reply({
                    content: "✔ Whitelist APROVADA!",
                    ephemeral: true
                });
            }

            // REJEITAR
            if (action === config.BUTTONS.REJECT) {

                return interaction.reply({
                    content: "❌ Whitelist REJEITADA!",
                    ephemeral: true
                });
            }
        }
    }
};

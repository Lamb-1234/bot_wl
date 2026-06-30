const { canHandleWL } = require("../utils/permissions");
const {
    approveWL,
    rejectWL
} = require("../utils/wlActions");

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
const wlStore = require("../data/wlStore");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        // =========================
// SLASH COMMANDS
// =========================
if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Ocorreu um erro ao executar este comando.",
                ephemeral: true
            });
        }
    }

    return;
}

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

            if (wlStore.hasWL(interaction.user.id)) {
                return interaction.reply({
                    content: "❌ Você já enviou sua whitelist.",
                    ephemeral: true
                });
            }

            wlStore.createWL(interaction.user.id, { nome, id });

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

            const msg = await channel.send({
                embeds: [embed],
                components: [row]
            });

            wlStore.updateWL(interaction.user.id, {
                messageId: msg.id
            });

            return interaction.reply({
                content: "✅ Sua whitelist foi enviada!",
                ephemeral: true
            });
        }

        // =========================
        // BOTÕES STAFF (APROVAR / REJEITAR)
        // =========================
        if (interaction.isButton()) {

            const [action, userId] = interaction.customId.split(":");
            if (!action || !userId) return;

            const isStaffAction =
                action === config.BUTTONS.ACCEPT ||
                action === config.BUTTONS.REJECT;

            if (isStaffAction && !canHandleWL(interaction.member)) {
                return interaction.reply({
                    content: "❌ Você não tem permissão para isso.",
                    ephemeral: true
                });
            }

            const wl = wlStore.getWL(userId);

            if (!wl || wl.status !== "pending") {
                return interaction.reply({
                    content: "⚠ Essa whitelist já foi finalizada.",
                    ephemeral: true
                });
            }

            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: "Usuário não encontrado.",
                    ephemeral: true
                });
            }

            const message = interaction.message;
            const embed = EmbedBuilder.from(message.embeds[0]);

            // =========================
            // APROVAR
            // =========================
            if (action === config.BUTTONS.ACCEPT) {

            const { approveWL } = require("../utils/wlActions");

            const success = await approveWL(client, interaction, userId);

            if (!success) {
                return interaction.reply({
                    content: "❌ Erro ao aprovar a whitelist.",
                    ephemeral: true
                });
            }

    const message = interaction.message;

    const embed = EmbedBuilder.from(message.embeds[0]);

    embed.setColor(config.COLORS.SUCCESS);
    embed.addFields({
        name: "🟢 Status",
        value: `APROVADA por ${interaction.user.tag}`
    });

    const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("disabled_accept")
            .setLabel("✔ Aprovada")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId("disabled_reject")
            .setLabel("❌ Rejeitar")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
    );

    await message.edit({
        embeds: [embed],
        components: [disabledRow]
    });

    return interaction.reply({
        content: "✔ Whitelist APROVADA!",
        ephemeral: true
    });
}
            // =========================
            // REJEITAR
            // =========================
            if (action === config.BUTTONS.REJECT) {

                const { rejectWL } = require("../utils/wlActions");
                const success = await rejectWL(client, interaction, userId);

                if (!success) {
                    return interaction.reply({
                        content: "❌ Erro ao rejeitar a whitelist.",
                        ephemeral: true
                    });
                }

                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("disabled_accept")
                        .setLabel("✔ Aprovar")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),

                    new ButtonBuilder()
                        .setCustomId("disabled_reject")
                        .setLabel("❌ Rejeitada")
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true)
                );

                await message.edit({
                    embeds: [embed],
                    components: [disabledRow]
                });

                return interaction.reply({
                    content: "❌ Whitelist REJEITADA!",
                    ephemeral: true
                });
            }
        }
    }
};

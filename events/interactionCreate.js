const { canHandleWL } = require("../utils/permissions");
const { sendLog } = require("../utils/logger");
const { setNickname } = require("../utils/nickname");
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

            // validação
            const errorName = validateName(nome);
            const errorId = validateId(id);

            if (errorName) {
                return interaction.reply({ content: errorName, ephemeral: true });
            }

            if (errorId) {
                return interaction.reply({ content: errorId, ephemeral: true });
            }

            // anti spam (1 WL por pessoa)
            if (wlStore.hasWL(interaction.user.id)) {
                return interaction.reply({
                    content: "❌ Você já enviou sua whitelist.",
                    ephemeral: true
                });
            }

            wlStore.createWL(interaction.user.id, {
                nome,
                id
            });

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
        // APROVAR / REJEITAR
        // =========================
        const staffMember = interaction.member;

if (!canHandleWL(staffMember)) {
    return interaction.reply({
        content: "❌ Você não tem permissão para isso.",
        ephemeral: true
    });
}
        if (interaction.isButton()) {

            const [action, userId] = interaction.customId.split(":");

            if (!action || !userId) return;

            const wl = wlStore.getWL(userId);

            // proteção contra dupla decisão
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
            await setNickname(member, wl.nome, wl.id);
            await sendLog(client, {
                    userTag: member.user.tag,
                    userId,
                    action: "APROVADA",
                    staff: interaction.user.tag
                });
            if (action === config.BUTTONS.ACCEPT) {

                await member.roles.add(config.ROLES.MEMBRO);
                await member.roles.remove(config.ROLES.OLHEIRO);

                wlStore.updateWL(userId, {
                    status: "approved"
                });
               

                // DM
                const user = await client.users.fetch(userId).catch(() => null);
                if (user) {
                    user.send("🌴 Sua whitelist foi APROVADA! Bem-vindo ao servidor.").catch(() => {});
                }

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
            await sendLog(client, {
                userTag: member.user.tag,
                userId,
                action: "REJEITADA",
                staff: interaction.user.tag
            });
            if (action === config.BUTTONS.REJECT) {

                wlStore.updateWL(userId, {
                    status: "rejected"
                });

                const user = await client.users.fetch(userId).catch(() => null);
                if (user) {
                    user.send("❌ Sua whitelist foi REJEITADA.").catch(() => {});
                }

                embed.setColor(config.COLORS.ERROR);
                embed.addFields({
                    name: "🔴 Status",
                    value: `REJEITADA por ${interaction.user.tag}`
                });

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

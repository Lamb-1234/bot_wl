const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../../config/config");
const { validateName, validateId } = require("../../utils/validators");
const wlStore = require("../../data/wlStore");

module.exports = async (interaction) => {

    const nome = interaction.fields.getTextInputValue("nome");
    const id = interaction.fields.getTextInputValue("id");

    // Validações
    const errorName = validateName(nome);
    if (errorName) {
        return interaction.reply({
            content: errorName,
            ephemeral: true
        });
    }

    const errorId = validateId(id);
    if (errorId) {
        return interaction.reply({
            content: errorId,
            ephemeral: true
        });
    }

    // Já possui WL?
    if (wlStore.hasWL(interaction.user.id)) {
        return interaction.reply({
            content: "❌ Você já enviou sua whitelist.",
            ephemeral: true
        });
    }

    // Cria registro
    wlStore.createWL(interaction.user.id, {
        nome,
        id
    });

    // Canal da staff
    const channel = await interaction.guild.channels
        .fetch(config.CHANNELS.WL_REQUESTS)
        .catch(() => null);

    if (!channel) {
        return interaction.reply({
            content: "❌ Canal de whitelist não encontrado.",
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setTitle("📋 NOVA WHITELIST")
        .setColor(config.COLORS.WARNING)
        .addFields(
            {
                name: "👤 Nome RP",
                value: nome
            },
            {
                name: "🆔 ID",
                value: id
            },
            {
                name: "👤 Discord",
                value: interaction.user.tag
            },
            {
                name: "📊 Status",
                value: "🟡 PENDENTE"
            }
        )
        .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(

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
        components: [buttons]
    }).catch(() => null);

    if (!msg) {

        return interaction.reply({
            content: "❌ Não foi possível enviar sua whitelist para a staff.",
            ephemeral: true
        });

    }

    wlStore.updateWL(interaction.user.id, {
        messageId: msg.id
    });

    return interaction.reply({
        content: "✅ Sua whitelist foi enviada com sucesso!",
        ephemeral: true
    });

};

const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config/config");

const filePath = path.join(__dirname, "../data/panel.json");

async function createOrUpdatePanel(client) {

    const channel = await client.channels.fetch(config.CHANNELS.WL_PANEL);

    if (!channel) {
        throw new Error("Canal do painel não encontrado.");
    }

    const embed = new EmbedBuilder()
        .setTitle("🌴 ROCINHA RP - WHITELIST")
        .setDescription("Clique no botão abaixo para iniciar sua whitelist.")
        .setColor(config.COLORS.PRIMARY)
        .setFooter({
            text: config.EMBED_FOOTER
        });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(config.BUTTONS.REQUEST_WL)
            .setLabel("Solicitar WL")
            .setStyle(ButtonStyle.Success)
    );

    let panelData = {};

    try {
        panelData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        panelData = {};
    }

    let message = null;

    // tenta buscar pelo ID salvo
    if (panelData.panelMessageId) {

        try {
            message = await channel.messages.fetch(panelData.panelMessageId);
        } catch {
            message = null;
        }

    }

    // procura algum painel antigo
    if (!message) {

        const messages = await channel.messages.fetch({ limit: 20 });

        message = messages.find(m =>
            m.author.id === client.user.id &&
            m.components.length > 0
        ) || null;

    }

    // cria novo
    if (!message) {

        message = await channel.send({
            embeds: [embed],
            components: [row]
        });

    }

    // atualiza
    else {

        await message.edit({
            embeds: [embed],
            components: [row]
        });

    }

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            {
                panelMessageId: message.id
            },
            null,
            2
        )
    );

    return message;

}

module.exports = {
    createOrUpdatePanel
};

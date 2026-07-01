const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const config = require("../../config/config");

module.exports = async (interaction) => {

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

};

const fs = require("fs");
const path = require("path");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require("../config/config");

const filePath = path.join(__dirname, "../data/panel.json");

module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {

        console.log(`Bot online: ${client.user.tag}`);

        const channel = await client.channels.fetch(config.CHANNELS.WL_PANEL);
        if (!channel) return console.log("Canal do painel não encontrado.");

        const embed = new EmbedBuilder()
            .setTitle("🌴 ROCINHA RP - WHITELIST")
            .setDescription("Clique no botão abaixo para iniciar sua whitelist.")
            .setColor(config.COLORS.PRIMARY)
            .setFooter({ text: config.EMBED_FOOTER });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(config.BUTTONS.REQUEST_WL)
                .setLabel("Solicitar WL")
                .setStyle(ButtonStyle.Success)
        );

        let data = {};

        try {
            data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch (e) {}

        // 🔥 SE JÁ EXISTE, EDITA EM VEZ DE CRIAR NOVO
        if (data.panelMessageId) {
            try {
                const msg = await channel.messages.fetch(data.panelMessageId);

                return await msg.edit({
                    embeds: [embed],
                    components: [row],
                });
            } catch (err) {
                console.log("Mensagem antiga não encontrada, criando nova...");
            }
        }

        // 🆕 CRIA NOVA E SALVA ID
        const msg = await channel.send({
            embeds: [embed],
            components: [row],
        });

        fs.writeFileSync(filePath, JSON.stringify({
            panelMessageId: msg.id
        }, null, 2));
    }
};

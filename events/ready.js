const fs = require("fs");
const path = require("path");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require("../config/config");

const filePath = path.join(__dirname, "../data/panel.json");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        // 🔥 TRAVA GLOBAL (EVITA DUPLO EXECUTE)
        if (global.__panelSent) return;
        global.__panelSent = true;

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
        } catch {
            data = {};
        }

        let msg = null;

        if (data.panelMessageId) {
            try {
                msg = await channel.messages.fetch(data.panelMessageId);
            } catch {
                msg = null;
            }
        }

        if (msg) {
            await msg.edit({ embeds: [embed], components: [row] });
            return;
        }

        const newMsg = await channel.send({
            embeds: [embed],
            components: [row],
        });

        fs.writeFileSync(filePath, JSON.stringify({
            panelMessageId: newMsg.id
        }, null, 2));

        console.log("Painel criado/salvo com sucesso:", newMsg.id);
    }
};

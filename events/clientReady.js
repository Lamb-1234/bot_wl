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

        // =========================
        // LÊ PAINEL SALVO
        // =========================
        let data = {};
        try {
            data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch {}

        // =========================
        // SE JÁ EXISTE PAINEL → EDITA
        // =========================
        if (data.panelMessageId) {
            const msg = await channel.messages.fetch(data.panelMessageId).catch(() => null);

            if (msg) {
                await msg.edit({
                    embeds: [embed],
                    components: [row],
                });

                return; // 🔥 NÃO CRIA OUTRO
            }
        }

        // =========================
        // SE NÃO EXISTE → CRIA
        // =========================
        const msg = await channel.send({
            embeds: [embed],
            components: [row],
        });

        fs.writeFileSync(filePath, JSON.stringify({
            panelMessageId: msg.id
        }, null, 2));
    }
};

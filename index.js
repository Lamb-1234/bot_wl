require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");

const config = require("./config/config");

// =====================
// ANTI-CRASH GLOBAL
// =====================
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("warning", (warn) => {
    console.warn("⚠️ Warning:", warn.message);
});

// =====================
// EXPRESS (Render fix)
// =====================
const app = express();

app.get("/", (_, res) => {
    res.send("Bot online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HTTP rodando na porta ${PORT}`);
});

// =====================
// DISCORD CLIENT
// =====================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

console.log("🚀 Iniciando bot...");

// =====================
// EVENTS LOADER (SAFE)
// =====================
const eventsPath = path.join(__dirname, "events");

let eventFiles = [];

try {
    eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));
} catch (err) {
    console.error("❌ Erro ao ler pasta events:", err);
}

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
        const event = require(filePath);

        if (!event?.name || !event?.execute) {
            console.warn(`⚠ Evento inválido ignorado: ${file}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(...args, client).catch?.(console.error)
            );
        } else {
            client.on(event.name, (...args) =>
                event.execute(...args, client).catch?.(console.error)
            );
        }

    } catch (err) {
        console.error(`❌ Erro ao carregar evento ${file}:`, err);
    }
}

// =====================
// LOGIN SAFE
// =====================
client.login(config.TOKEN)
    .then(() => console.log("🤖 Bot logado com sucesso"))
    .catch(err => console.error("❌ Erro no login:", err));

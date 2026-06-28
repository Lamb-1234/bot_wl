require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");

const config = require("./config/config");

// --------------------
// EXPRESS (Render fix)
// --------------------
const app = express();

app.get("/", (_, res) => {
    res.send("Bot online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HTTP rodando na porta ${PORT}`);
});

// --------------------
// DISCORD CLIENT
// --------------------
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

console.log("Iniciando bot...");

// --------------------
// EVENTS LOADER
// --------------------
const eventsPath = path.join(__dirname, "events");

const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// --------------------
client.login(config.TOKEN);

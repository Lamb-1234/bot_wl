const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./wl.db");

// cria tabela
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS whitelist (
            userId TEXT PRIMARY KEY,
            nome TEXT,
            idJogador TEXT,
            status TEXT,
            messageId TEXT
        )
    `);
});

module.exports = db;

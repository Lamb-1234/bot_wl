const db = require("../database/db");

// criar WL
function createWL(userId, nome, idJogador) {
    db.run(`
        INSERT OR REPLACE INTO whitelist (userId, nome, idJogador, status)
        VALUES (?, ?, ?, 'pending')
    `, [userId, nome, idJogador]);
}

// buscar WL
function getWL(userId, callback) {
    db.get(`
        SELECT * FROM whitelist WHERE userId = ?
    `, [userId], (err, row) => {
        callback(row);
    });
}

// atualizar status
function updateStatus(userId, status) {
    db.run(`
        UPDATE whitelist SET status = ? WHERE userId = ?
    `, [status, userId]);
}

// salvar messageId
function setMessageId(userId, messageId) {
    db.run(`
        UPDATE whitelist SET messageId = ? WHERE userId = ?
    `, [messageId, userId]);
}

module.exports = {
    createWL,
    getWL,
    updateStatus,
    setMessageId
};

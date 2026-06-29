console.log("OLHEIRO ID:", config.ROLES.OLHEIRO);

const role = member.guild.roles.cache.get(config.ROLES.OLHEIRO);

console.log("ROLE ENCONTRADA:", role);

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "wlData.json");

// garante que o arquivo existe
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
}

// lê dados do JSON
function readData() {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
        return {};
    }
}

// salva dados no JSON
function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {

    hasWL(userId) {
        const data = readData();
        return Boolean(data[userId]);
    },

    createWL(userId, dataWL) {
        const data = readData();

        data[userId] = {
            ...dataWL,
            status: "pending",
            createdAt: Date.now()
        };

        saveData(data);
    },

    getWL(userId) {
        const data = readData();
        return data[userId] || null;
    },

    updateWL(userId, newData) {
        const data = readData();

        if (!data[userId]) return false;

        data[userId] = {
            ...data[userId],
            ...newData,
            updatedAt: Date.now()
        };

        saveData(data);
        return true;
    },

    deleteWL(userId) {
        const data = readData();

        if (!data[userId]) return false;

        delete data[userId];
        saveData(data);
        return true;
    },

    getAllWL() {
        return readData();
    }
};

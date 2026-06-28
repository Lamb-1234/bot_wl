const wlUsers = new Map();

/*
status:
pending
approved
rejected
*/

function hasWL(userId) {
    return wlUsers.has(userId);
}

function getWL(userId) {
    return wlUsers.get(userId);
}

function createWL(userId, data) {
    wlUsers.set(userId, {
        status: "pending",
        ...data
    });
}

function updateWL(userId, data) {
    if (!wlUsers.has(userId)) return;
    wlUsers.set(userId, {
        ...wlUsers.get(userId),
        ...data
    });
}

module.exports = {
    hasWL,
    getWL,
    createWL,
    updateWL
};

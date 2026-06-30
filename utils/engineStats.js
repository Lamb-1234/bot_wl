const wlStore = require("../data/wlStore");

function getEngineStats() {

    const data = wlStore.getAllWL();

    let total = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const userId in data) {

        total++;

        switch (data[userId].status) {

            case "pending":
                pending++;
                break;

            case "approved":
                approved++;
                break;

            case "rejected":
                rejected++;
                break;
        }
    }

    return {
        total,
        pending,
        approved,
        rejected
    };
}

module.exports = {
    getEngineStats
};

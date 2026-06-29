const fs = require("fs");
const wlData = require("../data/wlData.json");

module.exports = async (member) => {
  const userId = member.id;

  if (wlData[userId]) {
    delete wlData[userId];

    fs.writeFileSync(
      "./data/wlData.json",
      JSON.stringify(wlData, null, 2)
    );
  }
};

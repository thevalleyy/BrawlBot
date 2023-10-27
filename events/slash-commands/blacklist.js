const util = require("util");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const user = interaction.options.get("user");

    // Todo: blacklist nach blacklist.json umschreiben
};

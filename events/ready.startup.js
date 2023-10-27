const Discord = require("discord.js");
const package = require("./../package.json").dependencies;
const fs = require("fs");

module.exports = async (client) => {
    // startup presence (now random)
    function setRandomPackageStatus() {
        const { maintenance } = JSON.parse(fs.readFileSync("./data/maintenance.json", "utf8"));
        if (maintenance == true) {
            client.user.setPresence({
                activities: [
                    {
                        name: "🛑 Wartungsmodus",
                        type: Discord.ActivityType.Playing,
                    },
                ],
                status: "dnd",
            });
        } else {
            const randomPackage = [Math.floor(Math.random() * Object.keys(package).length)];
            const potd = Object.keys(package)[randomPackage].toString();
            const votd = Object.values(package)[randomPackage].toString().replace("^", "");

            client.user.setPresence({
                activities: [{ name: `with ${potd} v${votd}` }],
            });
        }
    }
    setRandomPackageStatus();
    setInterval(function () {
        setRandomPackageStatus();
    }, 1200000);
};

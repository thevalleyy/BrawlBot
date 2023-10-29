const fs = require("fs");

module.exports = (client) => {
    const cmdJson = client.cmds;
    let array = [];

    Object.keys(cmdJson).forEach((command) => {
        const name = cmdJson[command].data.name;
        array.push(name.toLowerCase());

        client.cmdlist = array;
    });
};

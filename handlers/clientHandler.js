const {Collection} = require("discord.js")

module.exports = (client) => {
  client.commands = new Collection();
  client.events = new Collection();
  client.slashCommands = new Collection();
};
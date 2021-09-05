const guildSchema = require("../../resource/database/guild")

module.exports = async (client, message) => {
    const guildData = await guildSchema.find({ id: message.guild.id });

    const PREFIX = guildData[0].prefix; //change it according to your need
  
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
    const args = message.content.slice(PREFIX.length).split(/[ ]+/);
    const command = args.shift().toLowerCase();
    if (!command.length) return;
  
    const cmd = client.commands.get(command);
    if (!cmd) return;
  
    cmd.execute(client, message, args, PREFIX);
}
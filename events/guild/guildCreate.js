const guildSchema = require("../../resource/database/guild")
const fs = require("fs");

module.exports = async (client, guild) => {
    await new guildSchema({
        id: guild.id,
        name: guild.name,
        queue: [],
        volume: 50,
        maxVolume: 100,
        prefix: "-"
    }).save()

    const cmdFolders = fs.readdirSync("./SlashCommands");

    const cmdArr = [];
    cmdFolders.forEach(cmdFolder => {
      const cmdFiles = fs.readdirSync(`./SlashCommands/${cmdFolder}`).filter(f => f.endsWith(".js"));
  
      cmdFiles.forEach(file => {
        const command = require(`../../SlashCommands/${cmdFolder}/${file}`)
  
        if (command.name && command.execute) {
          cmdArr.push(command)
        }
      })
    });

    try {
        cmdArr.forEach(async cmd => {
            await guild.commands.create(cmd).catch(err => {})
          })
    } catch (err) {
        console.log(err)
    }

    console.log(`I have joined to ${guild.name}`);
}
const fs = require("fs");

module.exports = (client) => {
  const cmdFolders = fs.readdirSync("../SlashCommands");

  const cmdArr = [];
  cmdFolders.forEach(cmdFolder => {
    const cmdFiles = fs.readdirSync(`../SlashCommands/${cmdFolder}`).filter(f => f.endsWith(".js"));

    cmdFiles.forEach(file => {
      const command = require(`../SlashCommands/${cmdFolder}/${file}`)

      if (command.name && command.execute) {
        client.slashCommands.set(command.name, command);
        cmdArr.push(command)
      }
    })
  });

  client.on('ready', async () => {
    console.log("Ready Again");
    try {
      cmdArr.forEach(async cmd => {
        console.log(cmd);
        await client.guilds.cache.forEach(async guild =>{
          await guild?.commands.create(cmd).catch(err => {})
        })
      })
    } catch (err) {}
  })
}
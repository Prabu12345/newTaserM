const guildSchema = require("../../resource/database/guild")

module.exports = async (client, guild) => {
    await new guildSchema({
        id: guild.id,
        name: guild.name,
        queue: [],
        volume: 50,
        maxVolume: 100,
        prefix: "-"
    }).save()
    console.log(`I have joined to ${guild.name}`);
}
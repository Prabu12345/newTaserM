const guildSchema = require("../../resource/database/guild")

module.exports = async (client, guild) => {
    guildSchema.deleteOne({ id: guild.id }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`I have leaved ${guild.name} Server`);
        }
    })
}
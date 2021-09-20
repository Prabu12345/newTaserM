const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "stop",
  description: "Stops playing and leaves the Channel!",
  permissions: [],
  botPerms: [],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  // just for telling that u can also add options
  execute: async (client, interaction) => {
    try {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
          interaction.reply({ content: `:x: Join a channel and try again`, ephemeral: true });
          return;
        }  
        if (interaction.guild.me.voice.channel) {
          if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            return interaction.reply({ content: `:x: You must be in the same voice channel as the bot's in order to use that!`, ephemeral: true });
          }
        }

        let newQueue = client.distube.getQueue(interaction.guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
            await newQueue.stop()
            //Reply with a Message
            interaction.reply({
                embeds: [new MessageEmbed()
                  .setColor(config.normalColor)
                  .setTimestamp()
                  .setDescription(`⏹ **Stopped playing and left the Channel!**`)
                  .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
            })
        }
        await newQueue.stop()
        //Reply with a Message
        interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(config.normalColor)
              .setTimestamp()
              .setDescription(`⏹ **Stopped playing and left the Channel!**`)
              .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
        })
        return
    } catch (err) {
        console.log("Something Went Wrong => ", err);
    }
  },
};
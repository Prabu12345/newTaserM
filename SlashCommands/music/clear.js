const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require('../../config.json')

module.exports = {
  name: "clear",
  description: "Clear queue list.",
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
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setTitle(`:x: I am nothing Playing right now!`)
            ],
            ephemeral: true
        })
        let amount = newQueue.songs.length - 2;
        newQueue.songs = [newQueue.songs[0]];
        interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(config.normalColor)
              .setTimestamp()
              .setTitle(`**Cleared the Queue and deleted ${amount} Songs!**`)
              .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
        })
    } catch (err) {
        console.log("Something Went Wrong => ",err);
        interaction.editReply({
            content: `:x: | Error: `,
            embeds: [
                new MessageEmbed().setColor(config.errColor)
                .setDescription(`\`\`\`${err}\`\`\``)
            ],
            ephemeral: true
        })
    }
  },
};
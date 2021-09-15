const { Client, Interaction, MessageEmbed, GuildMember } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Set music volume.",
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
          interaction.reply({ content: `${xmoji} | Join a channel and try again`, ephemeral: true });
          return;
        }  
        if (interaction.guild.me.voice.channel) {
          if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            return interaction.reply({ content: `${xmoji} | You must be in the same voice channel as the bot's in order to use that!`, ephemeral: true });
          }
        }

        let newQueue = client.distube.getQueue(interaction.guildId);
        if (newQueue.songs.length == 0) {
            interaction.reply({
                content: `Nothing Played`,
                ephemeral: true
            })
        }
        await newQueue.skip();
        interaction.reply({
            content: `Skipping..`,
        })
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
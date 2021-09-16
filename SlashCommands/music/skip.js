const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip now playing music.",
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
          interaction.reply({ content: `:x: | Join a channel and try again`, ephemeral: true });
          return;
        }  
        if (interaction.guild.me.voice.channel) {
          if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            return interaction.reply({ content: `:x: You must be in the same voice channel as the bot's in order to use that!`, ephemeral: true });
          }
        }

        let newQueue = client.distube.getQueue(interaction.guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
            return interaction.reply({
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
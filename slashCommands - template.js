const { Client, Interaction, MessageEmbed, GuildMember } = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a song in your voice channel.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "input",
      description: "A search term or a link",
      type: 3,
      required: true,
    },
  ],
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
        const query = interaction.options._hoistedOptions.find((f) => f.name === "input").value;

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

        
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
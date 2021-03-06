const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require('../../config.json')

module.exports = {
  name: "volume",
  description: "Set music volume.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "input",
      description: "Percentage volume ( Max 150% )",
      type: 4,
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
        const volume = interaction.options._hoistedOptions.find((f) => f.name === "input").value;

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
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: I am nothing Playing right now!`)
            ],
            ephemeral: true
        })
        if (volume > 150 || volume < 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: The Volume must be between __0__ and __150__!`)
            ],
            ephemeral: true
        })
        await newQueue.setVolume(volume);
        interaction.reply({
            content: `Changed the Volume to __${volume}__%!`
        })
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
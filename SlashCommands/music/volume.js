const { Client, Interaction, MessageEmbed, GuildMember } = require("discord.js");
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
          interaction.reply({ content: `${xmoji} | Join a channel and try again`, ephemeral: true });
          return;
        }  
        if (interaction.guild.me.voice.channel) {
          if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            return interaction.reply({ content: `${xmoji} | You must be in the same voice channel as the bot's in order to use that!`, ephemeral: true });
          }
        }

        let voicemissing = interaction.member.voice.channel.permissionsFor(interaction.guild.me).missing(['SPEAK', 'CONNECT']);
        let missing = [];
        voicemissing.map(element =>
            missing.push(element)
        );
        if(missing.length > 0) {
            if(missing.length === 1) {
                return interaction.reply({ content: `I need the \`${permissions[missing[0]]}\` permission for this command to work.` });
            }
            return interaction.reply({ content: `I need the following permissions for this command to work: \`${missing.map(perm => permissions[perm]).join(', ')}\``});
        }

        let newQueue = client.distube.getQueue(guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setTitle(`:x: I am nothing Playing right now!`)
            ],
            ephemeral: true
        })
        if (volume > 150 || volume < 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **The Volume must be between \`0\` and \`150\`!**`)
            ],
            ephemeral: true
        })
        await newQueue.setVolume(volume);
        interaction.reply({
            content: `Changed the Volume to __\`${volume}\`__%!`
        })
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
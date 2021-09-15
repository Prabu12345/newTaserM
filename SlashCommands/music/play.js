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

        const Text = query

        await interaction.reply({
          content: `🔍 Searching... \`\`\`${Text}\`\`\``,
          ephemeral: true
        });

        let queue = client.distube.getQueue(interaction.guildId)
				let options = {
					member: interaction.member.guild,
				}
				if (!queue) options.textChannel = interaction.member.guild.channels.cache.get(interaction.channelId)
        await client.distube.playVoiceChannel(voiceChannel, Text, options)
				//Edit the reply
				interaction.editReply({
					content: `${queue?.songs?.length > 0 ? "👍 Added" : "🎶 Now Playing"}: \`\`\`css\n${Text}\n\`\`\``,
          ephemeral: true
				});
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
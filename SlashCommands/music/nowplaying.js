const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require('../../config.json')

module.exports = {
  name: "nowplaying",
  description: "Display the playing track.",
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

        // Now playing Function
        let newQueue = client.distube.getQueue(interaction.guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setTitle(`:x: I am nothing Playing right now!`)
            ],
            ephemeral: true
        })
        let newTrack = newQueue.songs[0];
        interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor)
                .setTitle(newTrack.name)
                .setURL(newTrack.url)
                .addField(`💡 Requested by:`, `>>> ${newTrack.member.user.tag}`, true)
                .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
                .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
                .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `:white_check_mark: \`Queue\`` : `:white_check_mark: \`Song\`` : `:x:`}`, true)
                .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `:white_check_mark: ` : `:v:`}`, true)
                .addField(`❔ Download Song:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
                .addField(`❔ Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `:x:`}`, newQueue.filters.length > 1 ? false : true)
                .addField(`View${newTrack.views > 0 ? "s": ""}:`, `>>> \`${newTrack.views}\``, true)
                .addField(`:thumbsup: Like${newTrack.likes > 0 ? "s": ""}:`, `>>> \`${newTrack.likes}\``, true)
                .addField(`:thumbsdown: Dislike${newTrack.dislikes > 0 ? "s": ""}:`, `>>> \`${newTrack.dislikes}\``, true)
                .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                .setFooter(`Played in: ${interaction.guild.name}`, interaction.guild.iconURL({
                    dynamic: true
                })).setTimestamp()
            ]
        }).catch((e) => {
            console.log(e.stack ? e.stack : e)
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
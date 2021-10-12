const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require('../../config.json')

module.exports = {
  name: "remove",
  description: "Removes one+ Song(s)",
  type: "CHAT_INPUT",
  options: [
    {
        name: "what_song",
        description: "What Song Index do you want to remove?",
        type: 3,
        required: true,
    },
    {
        name: "how_many",
        description: "How many Songs from there do you want to remove? (Default: 1)",
        type: 4,
        required: true,
    }
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
        const songIndex = interaction.options._hoistedOptions.find((f) => f.name === "what_song").value;
        const amount = interaction.options._hoistedOptions.find((f) => f.name === "how_many").value;

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

        let newQueue = client.distube.getQueue(interaction.guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **I am nothing Playing right now!**`)
            ],
            ephemeral: true
        })
        if (!amount) amount = 1;
        if (songIndex > newQueue.songs.length - 1) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **This Song does not exist!**,\n**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
            ],
            ephemeral: true
        })
        if (songIndex <= 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **You can't remove the current Song (0)!**`)
            ],
            ephemeral: true
        })
        if (amount <= 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **You need to at least remove 1 Song!**`)
            ],
            ephemeral: true
        })
        newQueue.songs.splice(songIndex, amount);
        interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(config.errColor)
              .setTimestamp()
              .setDescription(`**Removed ${amount} Song${amount > 1 ?"s": ""} out of the Queue!**`)
              .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
        })
        
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
const { Client, Interaction, MessageEmbed, 	MessageSelectMenu, MessageActionRow } = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "queue",
  description: "See music queue.",
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
                new MessageEmbed().setColor(config.errColor).setTitle(`:x: **I am nothing Playing right now!**`)
            ],
            ephemeral: true
        })
        let embeds = [];
        let k = 10;
        let theSongs = newQueue.songs;
        //defining each Pages
        for (let i = 0; i < theSongs.length; i += 10) {
            let qus = theSongs;
            const current = qus.slice(i, k)
            let j = i;
            const info = current.map((track) => `**${j++} -** [\`${String(track.name).replace(/\[/igu, "{").replace(/\]/igu, "}").substr(0, 60)}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
            const embed = new MessageEmbed()
                .setColor(config.normalColor)
                .setDescription(`${info}`)
            if (i < 10) {
                embed.setTitle(`📑 **Top ${theSongs.length > 50 ? 50 : theSongs.length} | Queue of ${interaction.member.guild.name}**`)
                embed.setDescription(`**(0) Current Song:**\n> [\`${theSongs[0].name.replace(/\[/igu, "{").replace(/\]/igu, "}")}\`](${theSongs[0].url})\n\n${info}`)
            }
            embeds.push(embed);
            k += 10; //Raise k to 10
        }
        embeds[embeds.length - 1] = embeds[embeds.length - 1]
            .setFooter(`\n${theSongs.length} Songs in the Queue | Duration: ${newQueue.formattedDuration}`)
        let pages = []
        for (let i = 0; i < embeds.length; i += 3) {
            pages.push(embeds.slice(i, i + 3));
        }
        pages = pages.slice(0, 24)
        const Menu = new MessageSelectMenu()
            .setCustomId("QUEUEPAGES")
            .setPlaceholder("Select a Page")
            .addOptions([
                pages.map((page, index) => {
                    let Obj = {};
                    Obj.label = `Page ${index}`
                    Obj.value = `${index}`;
                    Obj.description = `Shows the ${index}/${pages.length - 1} Page!`
                    return Obj;
                })
            ])
        const row = new MessageActionRow().addComponents([Menu])
        interaction.reply({
            embeds: [embeds[0]],
            components: [row],
            ephemeral: true
        });
        //Event
        client.on('interactionCreate', (i) => {
            if (!i.isSelectMenu()) return;
            if (i.customId === "QUEUEPAGES" && i.applicationId == client.user.id) {
                i.reply({
                    embeds: pages[Number(i.values[0])],
                    ephemeral: true
                }).catch(e => {})
            }
        });
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
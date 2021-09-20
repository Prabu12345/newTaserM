const { Client, Interaction, MessageEmbed, MessageButton } = require("discord.js");
const config = require('../../config.json');
const paginationEmbed = require('discordjs-button-pagination');

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
        let newQueue = client.distube.getQueue(interaction.guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: I am nothing Playing right now!`)
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
                embed.setTitle(`📑 **Queue of ${interaction.member.guild.name}**`)
                embed.setDescription(`**(0) Current Song:**\n> [\`${theSongs[0].name.replace(/\[/igu, "{").replace(/\]/igu, "}")}\`](${theSongs[0].url})\n\n${info}`)
            }
                embed.setFooter(`\n${theSongs.length} Songs in the Queue | Duration: ${newQueue.formattedDuration}`)
            embeds.push(embed);
            k += 10; //Raise k to 10
        }

        let button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Previous')
            .setStyle('SUCCESS')
        
        let button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Next')
            .setStyle('SUCCESS')

        let pages = embeds
            
        let buttonList = [
            button1,
            button2
        ]

        paginationEmbed(interaction, pages, buttonList, 60000);
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
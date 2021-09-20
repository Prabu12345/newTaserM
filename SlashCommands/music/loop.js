const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "loop",
  description: "Enable/Disable the Song- / Queue-Loop",
  type: "CHAT_INPUT",
  options: [
    {
      name: "input",
      description: "What Loop do you want to set?",
      type: 4,
      required: true,
      choices: [{
        name: "Disable",
        value: 0
      }, {
        name: "Song Loop",
        value: 1
      }, {
        name: "Queue Loop",
        value: 2
      }]
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

        let newQueue = client.distube.getQueue(interaction.guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
					embeds: [
						new MessageEmbed().setColor(config.errColor).setDescription(`:x: I am nothing Playing right now!`)
					],
					ephemeral: true
				})
				let loop = Number(query)
				await newQueue.setRepeatMode(loop);
				if (newQueue.repeatMode == 0) {
					interaction.reply({
						embeds: [new MessageEmbed()
						  .setColor(config.normalColor)
						  .setTimestamp()
						  .setDescription(`:x: Disabled the Loop Mode!`)
						  .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
					})
				} else if (newQueue.repeatMode == 1) {
					interaction.reply({
						embeds: [new MessageEmbed()
						  .setColor(config.normalColor)
						  .setTimestamp()
						  .setDescription(`🔁 **Enabled the __Song__-Loop** ||(Disabled the **Queue-Loop**)||`)
						  .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
						})
				} else {
					interaction.reply({
						embeds: [new MessageEmbed()
						  .setColor(config.normalColor)
						  .setTimestamp()
						  .setDescription(`🔂 **Enabled the __Queue__-Loop!** ||(Disabled the **Song-Loop**)||`)
						  .setFooter(`Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
						})
				}
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
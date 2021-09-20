const { Client, Interaction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "jump",
  description: "Jumps to a specific Song in the Queue",
  type: "CHAT_INPUT",
  options: [
    {
      name: "input",
      description: "To which Song do you want to jump in the Queue?",
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
        const Position = interaction.options._hoistedOptions.find((f) => f.name === "input").value;

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
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **I am nothing Playing right now!**`)
            ],
            ephemeral: true
        })
        if (Position > newQueue.songs.length - 1 || Position < 0) return interaction.reply({
            embeds: [
                new MessageEmbed().setColor(config.errColor).setDescription(`:x: **The Position must be between \`0\` and \`${newQueue.songs.length - 1}\`!**`)
            ],
            ephemeral: true
        })
        await newQueue.jump(Position);
        interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(config.normalColor)
              .setTimestamp()
              .setDescription(`👌 **Jumped to the \`${Position}th\` Song in the Queue!**`)
              .setFooter(`💢 Action by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))]
        })
    } catch (err) {
        console.log("Something Went Wrong => ",err);
    }
  },
};
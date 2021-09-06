const { Client, Interaction } = require("discord.js");
const guildSchema = require("../../resource/database/guild")

module.exports = {
  name: "prefix",
  description: "Change bot prefix",
  type: "CHAT_INPUT",
  options: [
    {
      name: "prefix",
      description: "what change to?",
      type: 3,
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  // just for telling that u can also add options
  execute: async (client, interaction) => {
    try {
      const newPrefix = interaction.options._hoistedOptions.find((f) => f.name === "prefix").value;
      
      await guildSchema.findOneAndUpdate(
        {
            id: interaction.guild.id
        },
        {
            prefix: newPrefix
        }
      )

      interaction.reply({content: `<@${interaction.author.id}>, Set the command prefix to \`${newPrefix}\`. To run commands, use \`${newPrefix}command\`.`})
    } catch (err) {
      console.log("Something Went Wrong => ",err);
    }
  },
};
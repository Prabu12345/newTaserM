const { Client, Interaction } = require("discord.js");

module.exports = {
  name: "say",
  description: "Says What Said To say",
  options: [
    {
      name: "text",
      description: "What To Say",
      type: 3,
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const whatToSay = interaction.options._hoistedOptions.find((f) => f.name === "text").value;

      await interaction.reply({ content: "Sending...", ephemeral: true });

      await interaction.channel.send({ content: whatToSay });
    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};
const { Client, Interaction, MessageEmbed } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
  try {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({content: "Something Went Wrong"});

      // Default Embed
      const embed = new MessageEmbed().setColor("RED");

      /*
      <==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>
      <==<==<==<==<==<==<==<==<==< P E R M I S S I O N S <==> H A N D L I N G >==>==>==>==>==>==>==>==>==>==>==>==>
      <==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>
      */

      if (!interaction.guild.me.permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])) {
        embed.setDescription(`:x: I Need \`SEND_MESSAGES\` & \`EMBED_LINKS\` Permission`)
        return await interaction.member.send({embeds:[embed], ephemeral: true})
      }


      /* || === || === || === || === || === || USER PERMISSION CHEKING || === || === || === || === || === || */
      if (!interaction.member.permissions.has(cmd.permissions || [])) {
        embed.setDescription(`:x: You Need these Permissions \`\`\`${cmd.permissions.join(", ")}\`\`\``)
        return await interaction.reply({embeds:[embed], ephemeral: true})
      }

      /* || === || === || === || === || === || BOT PERMISSION CHEKING || === || === || === || === || === || */
      if (!interaction.guild.me.permissions.has(cmd.botPerms || [])) {
        embed.setDescription(`:x: I Need these Permissions \`\`\`${cmd.permissions.join(", ")}\`\`\``)
        return await interaction.reply({embeds:[embed], ephemeral: true})
      }

      /* || === || === || === || === || === || BOT PERMISSION CHEKING FOR CHANNEL || === || === || === || === || === || */
      // permissions bot have for current channel its in
      const channelPerms = interaction.channel.permissionsFor(interaction.guild.me).toArray();

      const checkArr = [];
      const chPerms = cmd.chnlPerms || [];

      // now it will check if required permission is present or not
      // for eg.
      // for changing name of channel we need MANAGE_CHANNELS permission like if we dont have permission on our bot but we have permission for that channels like
      // LIKE this if i gave permission for that channel than we can check we have permission for that channel its needed to manage perfectly wihtout giving every permission to bot
      // if bot have permission for that channel then it will push true in array else false
      // NOTE: if bot globally have that permission than it will automatically have that permission for that channel
      channelPerms.forEach((x) => (chPerms.includes(x) ? checkArr.push(true) : checkArr.push(false)))

      // if dont have any permission from that array gave inside command
      if (checkArr.includes(false) && !checkArr.includes(true) && chPerms.length) {
        embed.setDescription(`I Need these Permission for ${interaction.channel.toString()} Channel \`\`\`${chPerms.join(", ")}\`\`\``)
        return await interaction.reply({embeds:[embed], ephemeral: true})
      }


      cmd.execute(client, interaction);
    }
  } catch (err) {
    console.log("Something Went Wrong => ",err);
  }
};
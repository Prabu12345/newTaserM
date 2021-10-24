const { Client, Intents, MessageEmbed } = require("discord.js");
const DisTube = require("distube").default;

const filters = require(`./filter.json`);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const config = require('./config.json')

let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
}
spotifyoptions.api = {
  clientId: '',
  clientSecret: '',
}

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  //youtubeCookie: config.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie 
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: filters,
  plugins: [
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin()
  ]
})

const status = queue =>
	`Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ')
		|| 'Off'}\` | Loop: \`${
		queue.repeatMode
			? queue.repeatMode === 2
				? 'All Queue'
				: 'This Song'
			: 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

const PlayerMap = new Map()

client.distube
	.on('playSong', async (queue, song) => {
    var embed = new MessageEmbed().setColor(config.normalColor)
    .addField(`Requested by`, `${song.member.user.tag}`, true)
    .addField(`Duration`, `${song.formattedDuration}`, true)
    .addField(`Queue`, `${queue.songs.length} song(s) - ${queue.formattedDuration}`, true)
    .addField(`Volume`, `${queue.volume}%`, true)
    .addField(`Loop`, `${queue.repeatMode ? queue.repeatMode === 2 ? `:white_check_mark: Queue` : `:white_check_mark: Song` : `:x:`}`, true)
    .addField(`Autoplay`, `${queue.autoplay ? `:white_check_mark:` : `:x:`}`, true)
    .addField(`Download Song`, `[Click here](${song.streamURL})`, true)
    .addField(`Filter${queue.filters.length > 0 ? "s": ""}:`, `${queue.filters && queue.filters.length > 0 ? `${queue.filters.map(f=>`${f}`).join(`, `)}` : `:x:`}`, queue.filters.length > 1 ? false : true)
    .setAuthor(`Now Playing`, `https://cdn.discordapp.com/attachments/706329990320488541/887977649492877382/tenor.gif`)
    .setDescription(`**[${song.name}](${song.url})**`)
    .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
    .setFooter(`${song.user.tag}`, song.user.displayAvatarURL({
      dynamic: true
    }))
    .setTimestamp();

		await queue.textChannel.send({ embeds: [embed] }).then(msg => {
      PlayerMap.set(`currentmsg`, msg.id);
      return msg;
    })
  })
	.on('addSong', async (queue, song) => {
    let text = `Added **[${song.name}](${song.url})** to the queue by **${song.member.user.tag}**`
    const Embed = new MessageEmbed()
    .setAuthor('Added to queue', 'https://cdn.discordapp.com/attachments/706329990320488541/887977649492877382/tenor.gif')
    .setColor(config.normalColor)
    .setDescription(text)
    .addField(`Song Duration`,`${song.formattedDuration}`, true)
    //.addField(`Estimated time`,`${queue.formattedDuration}`, true)
    .addField(`Potition`,`**#**${queue.songs.length} in queue`, true)
    .setThumbnail(song.thumbnail)
    .setTimestamp()
    queue.textChannel.send({ embeds: [Embed] })
  })
	.on('addList', async (queue, playlist) => {
    let text = 	`Added **[${playlist.name}](${playlist.url})** playlist (${playlist.songs.length} songs) to queue by **${playlist.member.user.tag}**`
    const Embed = new MessageEmbed()
    .setAuthor('Added to queue', 'https://cdn.discordapp.com/attachments/706329990320488541/887977649492877382/tenor.gif')
    .setColor(config.normalColor)
    .setDescription(text)
    .addField(`Playlist Duration`,`${playlist.formattedDuration}`, true)
    //.addField(`Estimated time`,`${queue.formattedDuration}`, true)
    .addField(`Potition`,`**#** ${queue.songs.length - playlist.songs.length} -> ${queue.songs.length} in queue`, true)
    .setThumbnail(playlist.thumbnail)
    .setTimestamp()
    queue.textChannel.send({ embeds: [Embed] })
  })
	// DisTubeOptions.searchSongs = true
	.on('searchResult', (message, result) => {
		let i = 0
		message.channel.send(
			`**Choose an option from below**\n${result
				.map(
					song =>
						`**${++i}**. ${song.name} - \`${
							song.formattedDuration
						}\``,
				)
				.join(
					'\n',
				)}\n*Enter anything else or wait 30 seconds to cancel*`,
		)
	})
	// DisTubeOptions.searchSongs = true
	.on('searchCancel', message => message.channel.send(`Searching canceled`))
	.on('searchInvalidAnswer', message => message.channel.send(`searchInvalidAnswer`))
	.on('searchNoResult', message => message.channel.send(`:x: No result found!`))
	.on('error', (textChannel, e) => {
		console.error(e)
		textChannel.send(`:x: An error encountered: ${e.slice(0, 2000)}`)
	})
	.on('finish', queue => queue.textChannel.send('Finish queue!'))
	.on('finishSong', queue => {
    queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
      currentSongPlayMsg.delete();
    }).catch((e) => {
      //console.log(e.stack ? String(e.stack).grey : String(e).grey)
    })
  })
	.on('disconnect', queue => {})
	.on('empty', queue => queue.textChannel.send('Voice channel is empty! leaving...'))

const { readdirSync } = require("fs");

const handlers = readdirSync("./handlers/").filter((f) => f.endsWith(".js"));

handlers.forEach((hanlder) => {
  require(`./handlers/${hanlder}`)(client);
});

client.login('');

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
  clientId: '540def33c9bb4c94b7d3b5bb51615624',
  clientSecret: '89c15cd0add944c6bef3be863b964d9f',
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

client.distube
	.on('playSong', async (queue, song) => {
    let text = `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.member.nickname}\n${status(queue)}`
    const Embed = new MessageEmbed()
    .setAuthor('Added to queue')
    .setColor(config.normalColor)
    .setDescription(text)
    .setThumbnail(song.thumbnail)
    .setTimestamp()
		let playMSG = await queue.textChannel.send(Embed)
    setTimeout(() => {
      playMSG.delete()
    }, song.duration*1000) 
  })
	.on('addSong', async (queue, song) => {
    let text = `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.member.nickname}\n${status(queue)}`
    const Embed = new MessageEmbed()
    .setAuthor('Added to queue')
    .setColor(config.normalColor)
    .setDescription(text)
    .setThumbnail(song.thumbnail)
    .setTimestamp()
    queue.textChannel.send(Embed)
  })
	.on('addList', async (queue, playlist) => {
    let text = 	`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue by ${playlist.member.nickname}\n${status(queue)}`
    const Embed = new MessageEmbed()
    .setAuthor('Added to queue')
    .setColor(config.normalColor)
    .setDescription(text)
    .setTimestamp()
    queue.textChannel.send(Embed)
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
	.on('searchInvalidAnswer', message =>
		message.channel.send(`searchInvalidAnswer`))
	.on('searchNoResult', message => message.channel.send(`:x: No result found!`))
	.on('error', (textChannel, e) => {
		console.error(e)
		textChannel.send(`:x: An error encountered: ${e.slice(0, 2000)}`)
	})
	.on('finish', queue => queue.textChannel.send('Finish queue!'))
	.on('finishSong', queue => {})
	.on('disconnect', queue => queue.textChannel.send('Disconnected!'))
	.on('empty', queue => queue.textChannel.send('Voice channel is empty! leaving...'))

const { readdirSync } = require("fs");

const handlers = readdirSync("./handlers/").filter((f) => f.endsWith(".js"));

handlers.forEach((hanlder) => {
  require(`./handlers/${hanlder}`)(client);
});

client.login('MjcwMDc0OTgxNzAwOTkzMDI0.WHsU7Q.tY_YF61g1HLSjniFFZq5QR3olR4');
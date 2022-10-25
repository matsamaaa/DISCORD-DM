const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Send a message a all users !')
		.addStringOption(option => 
			option.setName('message')
			.setDescription('Choose a message')
			.setRequired(true)),
	async execute(interaction) {

		try {
			
			let counts = {
				blocked: 0,
				sending: 0,
				bots: 0
			};
			const member = interaction.member;
			const message = interaction.options.getString('message');

			//permissions
			if(!member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: 'An error as occured with permissions !', ephemeral: false })

			//wait res
			const wait = new EmbedBuilder()
			.setColor(`#ff8800`)
			.addFields({ name: 'Use ✅ or ❌ to send your message.', value: message })

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('accept')
					.setLabel('Accept ✅')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('decline')
					.setLabel('Decline ❌')
					.setStyle(ButtonStyle.Danger),
			);
			
			await interaction.reply({ embeds: [wait], components: [row], fetchReply: true, ephemeral: false });
			const filter = i => i.user.id === member.id;
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

			collector.on('collect', async (i) => {

				let data = {
					msg: null,
					color: null,
					status: false
				};

				if(i.customId === 'accept') data = { msg: "✅ Your message has been validated and is being sent.", color: "#16B300", status: true };
				else if(i.customId === 'decline') data = { msg: "❌ Your message has been canceled.", color: "#FF0000", status: false };

				const embed = new EmbedBuilder()
				.setColor(data.color)
				.setTitle(data.msg)
				await i.update({ embeds: [embed], components: [] });
				setTimeout(() => interaction.deleteReply(), 4000);

				if(data.status) {
					const work = new EmbedBuilder()
					.setColor(data.color)
					.setTitle("Work in Progress")
					let m = await interaction.channel.send({ embeds: [work], fetchReply: true })

					//fetch all members
					const members = await interaction.guild.members.fetch();
					members.forEach(async(member) => {
						try{
							if(member.user.bot == true) counts.bots++
							else {
								await interaction.guild.members.cache.get(member.id).send(message)
								.then(counts.sending++)
							}
						} catch(err){
							counts.blocked++
						}
					})

					const embed = new EmbedBuilder()
					.setColor(data.color)
					.addFields({ name: `❕ Stats of **${member.user.username}**'s message`, value: `🌐 Total Members: ${counts.blocked + counts.bots + counts.sending}\n🚀 Sent message: ${counts.sending}\n🤖 Bot: ${counts.bots}\n🛑 Blocked messages: ${counts.blocked}` })
					return m.edit({ embeds: [embed] });

				}

			})

		} catch(error) {
			console.log('\033[0m[\033[0;31m!\033[0m] ' + `An Error has occured in Send Command !`);
		}

	},
};
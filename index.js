const { Client, Collection, IntentsBitField } = require('discord.js');
const fs = require('fs');
require("dotenv").config()

const client = new Client({ intents: new IntentsBitField(3243773)})
client.commands = new Collection();

//commands
const commandsFolder = fs.readdirSync(`${__dirname}/commands`)
for(const folder of commandsFolder) {
	fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    })
}

//events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
	const event = require(`./events/${file}`);
	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//login
client.login(process.env.TOKEN)
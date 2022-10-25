const { ActivityType } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ready',
    async execute(client){

        //Adding Commands
        const commandsFolder = fs.readdirSync(`./commands`)
        let commandsListe = [];
        for(const folder of commandsFolder) {
            fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')).forEach(file => {
                const command = require(`../commands/${folder}/${file}`)
                console.log(file)
                commandsListe.push(command.data)
            })
        }

        //Setup Commands
        client.application.commands.set(commandsListe.map(cmd => cmd))
        client.guilds.cache.get(process.env.GUILD_ID).commands.set(commandsListe.map(cmd => cmd))

        //Log Connexion
        console.log('\033[0m[\033[0;32m✔\033[0m] ' + `${client.user.username} is now Online !`);

        //Changing Statut
        const activities = (process.env.ACTIVITIES).split(',');
        let i = 0;
        setInterval(function() {
            if(!activities[i]) i = 0;
            else {
                let act = activities[i];
                if(act === 'SERVERSCOUNT') act = `${client.guilds.cache.size} Servers`;
                else if(act === 'MEMBERSCOUNT') act = `${client.users.cache.size.toLocaleString()} Users`;
                client.user.setPresence({
                    activities: [{ name: act, type: ActivityType.Competing }],
                    status: 'dnd',
                });
                i++
            }
        }, 10000)

    }
}
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client){

        try {
    
            if (!interaction.isCommand()) return;
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
    
            try {

                //Startup Command
                if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: 'An error as occured with permissions !', ephemeral: false })
                const commandName = command.data.name;
                if(!client.commands.has(commandName)) return console.log('\033[0m[\033[0;31m!\033[0m] ' + `Invalid Command !`);

                client.commands.get(commandName).execute(interaction, client)

            } catch (error) {
                console.log('\033[0m[\033[0;31m!\033[0m] ' + `An Error has occured in Startup Command !`);
                return interaction.reply({ content: 'An error as occured !', ephemeral: false })
            }

        } catch {
            console.log('\033[0m[\033[0;31m!\033[0m] ' + `An Error has occured in Loading Command !`);
        }

    }
}
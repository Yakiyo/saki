import { SlashCommandBuilder, type Role, type GuildMember } from "discord.js";
import type { Command } from "../../struct/types";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('randompick')
        .setDescription('Picks a number \'n\' of random users from a specified role.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to choose from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of users to pick')
                .setMinValue(1)),
    async execute(interaction) {
        await interaction.deferReply();
        const n = interaction.options.getInteger('number') || 1;
        const role = interaction.options.getRole('role') as Role;

        const members = await interaction.guild?.members.fetch().then(v => v.values());
        const m = Array.from(members as IterableIterator<GuildMember>)
            .filter(g => g.roles.cache.has(role.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, n)
            .map(v => `<@${v.id}>`);

        interaction.editReply({
            embeds: [{
                title: 'Random Pick',
                color: 16102651,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/483063348792000513/880878403497099284/icon-randomphone.png'
                },
                fields: [{
                    name: `__Role__`,
                    value: `<@&${role.id}>`
                },{
                    name: `__Users picked__`,
                    value: m.join('\n'),
                }]
            }]
        });
    },
}
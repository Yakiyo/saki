import type { APIEmbed, GuildMember, User } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";

export const command: Command = {
	data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Give\'s a user\'s default or server avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Optional user whose avatar to show'))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Default or server avatar to show')
                .addChoices({ name: 'Default', value: 'DEFAULT' }, { name: 'Server', value: 'SERVER' })),
	async execute(interaction) {
		const member = (interaction.options.getUser('user') ? await interaction.guild?.members.fetch(interaction.options.getUser('user') as User) : interaction.member) as GuildMember;
        const type = interaction.options.getString("type") || 'DEFAULT';
        
        let links, url: string | null;
        if (type === 'SERVER') {
            url = member.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 });
            links = {
                name: 'Links as',
                value: `[png](${member.displayAvatarURL({ extension: 'png', forceStatic: true })}) | [jpg](${member.displayAvatarURL({ extension: 'jpg', forceStatic: true })}) | [webp](${member.displayAvatarURL({ extension: 'webp', forceStatic: true })})`,
            }
        } else {
            links = {
                name: 'Links as',
                value: `[png](${member.user.avatarURL({ extension: 'png', forceStatic: true })}) | [jpg](${member.user.avatarURL({ extension: 'jpg', forceStatic: true })}) | [webp](${member.user.avatarURL({ extension: 'webp', forceStatic: true })})`,
            }
            url = member.user.avatarURL({ extension: 'png', forceStatic: false, size: 1024 });
        }
        const embed = {
            title: `Avatar for ${member.user.tag}`,
            color: 16105148,
            fields: [
                links,
            ],
            image: {
                url: url
            },
            footer: {
                text: 'Generated on',
            },
            timestamp: new Date().toISOString(),
        };
        await interaction.reply({ embeds: [embed as APIEmbed] });
	},
}
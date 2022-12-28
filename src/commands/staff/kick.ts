import { type GuildMember, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { log, sendLog, LogDestination } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user from the server')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to kick from the server')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('The reason for banning the user')
		),
	async execute(interaction) {
		await interaction.deferReply();
		const target = (await interaction.guild?.members.fetch(
			interaction.options.getUser('user')?.id as string
		)) as GuildMember;
		const reason = interaction.options.getString('reason') as
			| string
			| undefined;
		if (!interaction.guild?.members.me?.permissions.has('KickMembers')) {
			interaction.editReply(
				'I do not have the required permissions to kick users.'
			);
			return;
		}
		if (!target.kickable) {
			interaction.editReply(
				'Target user is higher than me in hierarchy. Cannot kick them. Please give me a higher role'
			);
			return;
		}
		await target
			.send({
				embeds: [
					{
						description: `You have been kicked from **Gimai Seikatsu** server.\n${
							reason ? '**Reason:** ' + reason : ''
						}`,
						color: 16025922,
					},
				],
			})
			.catch(log);

		try {
			await interaction.guild.members.kick(target, reason);
		} catch (e) {
			log(e);
			interaction.editReply(
				'Unexpected error while attempting to kick user.'
			);
			return;
		}
		sendLog(
			{
				title: 'Kick Case',
				color: 16025922,
				description: `**Offender:** ${target.user.id} | <@!${
					target.user.id
				}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${
					reason || 'No reason provided'
				}`,
			},
			LogDestination.mod
		);

		interaction.editReply('Successfully kicked user from server');
	},
};

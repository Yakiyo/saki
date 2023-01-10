import { SlashCommandBuilder, type FetchMemberOptions, Colors } from 'discord.js';
import type { Command } from '../../struct/types';
import { isStaff, log, sendLog, LogDestination } from '../../util';

const sathya_id = '785869374639833132'; // Yes i'll rig it against him :)

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('spank')
		.setDescription('Mutes a user for 1 minute')
		.addUserOption((option) =>
			option.setName('user').setDescription('The user to mute').setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();
		if (!interaction.guild?.members.me?.permissions.has('ModerateMembers')) {
			interaction.editReply('I do not have the required permissions to mute or unmute users.');
			return;
		}
		const target = await interaction.guild.members.fetch(
			interaction.options.getUser('user') as unknown as FetchMemberOptions,
		);

		// Haha rig against sathya
		if (interaction.user.id === sathya_id && isStaff(target)) {
			interaction.editReply("Sathya, don't try to spank ur fellow mods." + '\nRegards:\nYakiyo');
			return;
		}

		if (!target.moderatable) {
			interaction.editReply('This user is higher then me in hierarchy. Cannot timeout them');
			return;
		}
		// Timeout for 1 min -> 1 min * 60 seconds * 1000 ms -> 6 * 10^4 ms (??)
		await target.timeout(1 * 60 * 1000);

		target
			.send({
				embeds: [
					{
						description:
							'You have been muted in **Gimai Seikatsu** server for 1 minute.\n**Reason:** Spanks',
						color: 16025922,
					},
				],
			})
			.catch(log);

		sendLog(
			{
				title: 'Spank Case',
				color: Colors.Green,
				description: `**Offender:** ${target.user.id} | <@!${target.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** Spanks\n**Duration:** 1 minute`,
			},
			LogDestination.mod,
		);

		interaction.editReply({
			embeds: [
				{
					color: 16105148,
					description: `<@!${target.user.id}> has been spanked by <@!${interaction.user.id}>`,
				},
			],
		});
	},
};

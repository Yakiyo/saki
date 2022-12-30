import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { casify } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('modules')
		.setDescription('Display the bot modules.'),
	async execute(interaction) {
		await interaction.deferReply();

		const modules = await global.prisma.modules.findUnique({
			where: {
				id: 1
			}
		});

		const buttons = [];
		for (const k in modules) {
			if (k === 'id') continue;

			buttons.push(new ButtonBuilder()
				.setCustomId(`MOD_${k}`)
				.setLabel(casify(k))
				// @ts-ignore
				.setStyle(modules[k] ? ButtonStyle.Success : ButtonStyle.Danger));
		}

		const rows: ActionRowBuilder<ButtonBuilder>[] = [];
		while (buttons.length !== 0) {
			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(buttons.splice(0, 5));
			rows.push(row);
		}

		interaction.editReply({
			embeds: [
				{
					image: {
						url: 'https://cdn.discordapp.com/attachments/483063348792000513/861372459701501982/Untitled.png',
					},
				},
			],
			components: rows
		});
	},
};

import { Collection, SlashCommandBuilder, type APIEmbedField } from 'discord.js';
import { casify } from '../../util';
import { type Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display the bot commands.'),
	async execute(interaction) {
		await interaction.deferReply();
		// @ts-ignore
		const { commands } = interaction.client.commandHandler as {
			commands: Collection<string, Command>;
		};
		const categories = new Collection<string, Collection<string, Command>>();
		commands.forEach((c) => {
			const category = categories.get(c.category as string);
			if (category) {
				category.set(c.data.name, c);
			} else {
				categories.set(
					c.category as string,
					new Collection().set(c.data.name, c) as Collection<string, Command>
				);
			}
		});

		interaction.editReply({
			embeds: [
				{
					title: 'Help',
					color: 16105148,
					fields: categories.map((c) => {
						return {
							name: `__${casify(c.first()?.category as string)}__`,
							value: c
								.map(
									(com) =>
										`\`${com.data.name}\`: ${com.data.description}`
								)
								.join('\n'),
						};
					}) as APIEmbedField[],
					footer: {
						text: 'Generated on',
					},
					timestamp: new Date().toISOString(),
				},
			],
		});
	},
};

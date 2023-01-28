import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('addemote')
		.setDescription('Add a new emote to the server.')
		.addStringOption((option) =>
			option.setName('name').setDescription('The name of the emoji to be added').setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('image')
				.setDescription('Link of the image to be used for the emoji')
				.setRequired(true),
		),
	async execute(interaction) {
		const name = interaction.options.getString('name')?.replace(/ +/, '_') as string;
		const attachment = interaction.options.getString('image') as string;
		if (!/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gim.test(attachment))
			return interaction.reply({
				content:
					'Second argument does not seem to be a valid image link. Please provide a link to a png/jpg/webp/gif file.',
				ephemeral: true,
			});
		await interaction.deferReply();
		try {
			const emoji = await interaction.guild?.emojis.create({
				attachment,
				name,
			});
			return interaction.editReply(`Successfully created emoji with name **${emoji?.name}**`);
		} catch (e) {
			log(e);
			return await interaction.editReply(
				'Error while creating emoji. \nPossible Reasons: Image file too big, invalid file type, maximum emoji limit for the server or invalid characters in emoji name.',
			);
		}
	},
};

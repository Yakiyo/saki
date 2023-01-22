import type { Event } from '../struct/types';
import {
	Events,
	type Interaction,
	InteractionType,
	type ChatInputCommandInteraction,
	ComponentType,
	ButtonStyle,
	ActionRowBuilder,
	ButtonBuilder,
	GuildMember,
} from 'discord.js';
import { isStaff } from '../util';

export const event: Event = {
	name: Events.InteractionCreate,
	async handle(interaction: Interaction) {
		switch (interaction.type) {
			// Handle slash commands
			case InteractionType.ApplicationCommand: {
				await client.commandHandler.handleCommand(interaction as ChatInputCommandInteraction);
				break;
			}

			// Handle incoming button interactions or Select Menus and stuff
			case InteractionType.MessageComponent: {
				if (!interaction.isButton()) return; // For now, we only handle buttons

				if (!interaction.customId.startsWith('MOD')) return;

				if (!isStaff(interaction.member as GuildMember)) {
					interaction.reply({
						content: 'Mod only usage',
						ephemeral: true,
					});
					return;
				}
				await interaction.deferUpdate();

				const cid = interaction.customId.replace('MOD_', '');

				const modules = await prisma.modules.findUnique({
					where: {
						id: 1,
					},
				});
				const data: Record<string, boolean> = {};
				// @ts-expect-error
				data[cid] = !modules[cid];

				await prisma.modules.update({
					where: {
						id: 1,
					},
					data,
				});

				const rows: ActionRowBuilder<ButtonBuilder>[] = [];
				for (const comp of interaction.message.components) {
					const row = [];
					for (let button of comp.components) {
						if (button.type !== ComponentType.Button) continue;

						const butt = ButtonBuilder.from(button);
						if (button.customId === `MOD_${cid}`) {
							butt.setStyle(data[cid] ? ButtonStyle.Success : ButtonStyle.Danger);
						}
						row.push(butt);
					}
					rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(...row));
				}
				await interaction.editReply({
					content: interaction.message.content,
					embeds: interaction.message.embeds,
					components: rows,
				});

				interaction.followUp({
					embeds: [
						{
							description: `Module \`${cid}\` has been ${data[cid] ? 'enabled' : 'disabled'}`,
							color: data[cid] ? 4388007 : 16025922,
						},
					],
					ephemeral: true,
				});
				jobHandler.switchJobs(cid, data[cid]);
				break;
			}
		}
	},
};

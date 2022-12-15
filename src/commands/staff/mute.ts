import { FetchMemberOptions, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../struct/types";
import ms from '@naval-base/ms';
import { LogDestination, sendLog } from "../../util";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Add or remove mutes on users')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Mutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to mute')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('The duration to mute the user')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for muting the user')))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Unmutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to unmute')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for unmuting the user'))),
    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.guild?.members.me?.permissions.has('ModerateMembers')) {
            interaction.editReply('I do not have the required permissions to mute or unmute users.');
            return;
        }
        const target = await interaction.guild.members.fetch(interaction.options.getUser('user') as unknown as FetchMemberOptions);
        if (!target.moderatable) {
            interaction.editReply('This user is higher then me in hierarchy. Cannot timeout them');
            return;
        }
        const reason = interaction.options.getString('reason') as string | undefined;
        switch (interaction.options.getSubcommand()) {
            case 'add': {
                let time: number | null;
                try {
                    time = ms(interaction.options.getString('duration') as string);
                } catch (_) {
                    time = null;
                }
                if (!time) {
                    interaction.editReply('Invalid time format. Please provide a valid duration.');
                    return;
                }
                await target.timeout(time, reason);
                
                target.send({
                    embeds: [{
                        description: `You have been muted in **Gimai Seikatsu** server.\n${ reason ? '**Reason:** ' + reason : '' }`,
                        color: 16025922,
                    }]
                }).catch(console.error);

                sendLog({
                    title: 'Mute Case',
                    color: 16025922,
                    description: `**Offender:** ${target.user.id} | <@!${target.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason || 'No reason provided'}\n**Duration:** ${ms(time, true)}`,
                }, LogDestination.mod);
                interaction.editReply(`Successfully timed out **${target.user.tag}** for ${ms(time, true)} duration`);
                break;
            }
            case 'remove': {
                if (!target.isCommunicationDisabled()) {
                    interaction.editReply('Target user is not timed out. Cannot untimeout.');
                    return;
                }
                await target.timeout(null, reason);
                
                target.send({
                    embeds: [{
                        description: 'You have been unmuted in **Gimai Seikatsu** server.',
                        color: 243000,
                    }]
                }).catch(console.error);

                sendLog({
                    title: 'Unmute Case',
                    color: 4388007,
                    description: `**Offender:** ${target.user.id} | <@!${target.user.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason || 'No reason provided'}\n`,
                }, LogDestination.mod);
                interaction.editReply(`Successfully untimed out **${target.user.tag}**`);
                break;
            }
        
            default:
                interaction.editReply('Unknown subcommand received');
        }
        return;
    },
}
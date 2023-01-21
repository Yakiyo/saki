/**
 * Seed db with prisma
 *
 * This populates the database with the basic required entries, which are the
 * module entry and the cache. Run the following command to seed it:
 *
 *   $ npm run prs:seed
 *
 * More details at: https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	/// Seed module
	let module = await prisma.modules.findUnique({
		where: {
			id: 1,
		},
	});
	if (!module) {
		console.info('Module entry is missing. Proceeding to seed modules...');
		module = await prisma.modules.create({
			data: {
				id: 1,
			},
		});
	}

	/// Seed cache
	let cache = await prisma.cache.findUnique({
		where: {
			id: 1,
		},
	});
	if (!cache) {
		console.info('Cache entry is missing. Proceeding to seed cache...');
		cache = await prisma.cache.create({
			data: {
				id: 1,
				chapter: {
					set: {
						link: 'https://cclawtranslations.home.blog/2022/12/26/gimai-seikatsu-volume-7-chapter-12/',
					},
				},
				reddit: {
					set: {
						link: 'https://www.reddit.com/r/GimaiSeikatsu/comments/zwd55s/the_newlyweds_and_stepsiblings_collab_punishments/',
					},
				},
				twitter: {
					set: {
						link: 'https://twitter.com/gimaiseikatsu/status/1609491485891887104',
					},
				},
				youtube: {
					set: {
						link: 'https://youtu.be/g54j7B3S_fA',
					},
				},
			},
		});
	}

	/// Seed reaction roles
	let rr = await prisma.reactionroles.findMany();

	if (!rr.length) {
		console.info('Reaction roles are missing. Proceeding to seed reaction roles');
		await prisma.reactionroles.createMany({
			data: [
				// Verification role on server join
				{
					message: '808385401445548042',
					reaction: '✅',
					role: '803201479736819733',
					channel: '808067819118919750',
					type: 'VERIFY',
				},
				// Character roles
				{
					message: '808386799889547315',
					reaction: '808149174095839233',
					role: '803205913733234689',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '808149218727428126',
					channel: '804733433724272651',
					role: '803609345602486332',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '808149270044606464',
					role: '803609470185766932',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '808149296561258517',
					role: '803609560853381172',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '810324441145016320',
					role: '803609645637042186',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '810324473974095890',
					role: '803648727767580733',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '810324592501063691',
					role: '803648788375011348',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '920717700752363560',
					role: '920697541056659457',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '920717662571622522',
					role: '920697555568980028',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386799889547315',
					reaction: '920717741634240592',
					role: '920697548736454727',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				// Special roles
				{
					message: '808386867178897429',
					reaction: '📣',
					role: '808757008739336242',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '📰',
					role: '808757083201339474',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '🎦',
					role: '1000722297302286376',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '📗',
					role: '808757166344503367',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '📙',
					role: '819959872614563870',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '808148339694633010',
					role: '808757223244300311',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '820269445012389888',
					role: '807204566072426506',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '🎉',
					role: '852924366739341383',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
				{
					message: '808386867178897429',
					reaction: '👩‍❤️‍👨',
					role: '817844054326247504',
					channel: '804733433724272651',
					type: 'NORMAL',
				},
			],
		});
		rr = await prisma.reactionroles.findMany();
	}

	console.info('Retrieved values', module, cache, rr);
}

let exit = 0;

main()
	.catch((e) => {
		console.error(e);
		exit = 1;
	})
	.finally(() => {
		prisma.$disconnect();
		process.exit(exit);
	});

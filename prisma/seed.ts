/**
 * Seed db with prisma
 *
 * This populates the database with the basic required entries, which are the
 * module entry and the cache. Run the following command to seed it:
 *
 *   $ npm run seed
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
				// TODO: These need to be filled later on
				id: 1,
				chapter:
					'https://cclawtranslations.home.blog/2022/12/26/gimai-seikatsu-volume-7-chapter-12/',
				reddit: '',
				twitter: '',
				youtube: '',
			},
		});
	}

	console.info('Retrieved values', module, cache);
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

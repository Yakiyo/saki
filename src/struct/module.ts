import { Modules } from '@prisma/client';
const { prisma } = global;

// @ts-ignore
const JOB_MODULES = ['Chapters', 'Mangadex', 'Reddit', 'Twitter', 'Youtube'];

/**
 * A class for working with modules.
 *
 * This class is to provide a sort of caching. Instead of fetching from the database everytime,
 * we maintain a local cached version of modules in the classes prop. Whenever a module entry
 * is updated in the db, the class will also update the local cache. This prevents from fetching
 * from the database everytime.
 */
export class Module {
	modules?: Modules;

	constructor() {
		this.get();
	}

	public async update(key: string, value: boolean) {
		const data: Record<string, boolean> = {};
		data[key] = value;
		// Update the value
		await prisma.modules.update({
			where: {
				id: 1,
			},
			data,
		});
		// Then set it to the class's modules prop
		await this.get();
		return this;
	}

	private async get() {
		const modules = await prisma.modules.findUnique({
			where: {
				id: 1,
			},
		});
		if (!modules) throw new Error(`Modules is not defined. Seed db before starting`);

		this.modules = modules;
		return this;
	}

	async switchJob(_key: string) {}
}

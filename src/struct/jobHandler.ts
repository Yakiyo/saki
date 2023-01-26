import { Collection } from 'discord.js';
import { Job } from './types';
import { join, resolve } from 'path';
import { readdirSync } from 'node:fs';

export class JobHandler {
	public jobs: Collection<string, Job>;

	constructor() {
		this.jobs = new Collection();
		(async () => {
			const jobs = await this.loadJobs().then((v) => v.jobs);
			const modules = await prisma.modules.findUnique({
				where: {
					id: 1,
				},
			});

			for (const k in modules) {
				const job = jobs.get(k);
				if (!job) continue;

				// @ts-ignore
				if (modules[k]) {
					job.init();
				}
			}
		})();
	}

	private async loadJobs() {
		const path = join(__dirname, '..', 'jobs');
		const files = readdirSync(path).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));

		for (const file of files) {
			const { job } = require(resolve(process.cwd(), `${path}/${file}`)) as {
				job: Job;
			};
			this.jobs.set(job.name, job);
		}

		return this;
	}
	/**
	 * A method to turn on or off jobs
	 * @param name Name of the Job
	 * @param state Wether to run or stop the job
	 * @returns this
	 */
	public async switchJobs(name: string, state: boolean) {
		const job = this.jobs.get(name);

		if (!job) return this;

		if (state) {
			// if it isnt running, run it.
			if (!job.id) job.init();
			// otherwise we don't bother
		} else {
			// if it is running, we stop it.
			if (job.id) job.stop();
			// else we dont bother
		}
		return this;
	}
}

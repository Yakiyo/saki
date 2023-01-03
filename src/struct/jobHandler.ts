import { Collection } from "discord.js";
import { Job } from "./types";
import { join, resolve } from "path";
import { readdirSync } from 'node:fs';

export class JobHandler {
    public jobs: Collection<string, Job>

    constructor() {
        this.jobs = new Collection();
        this.loadJobs();
    }

    private async loadJobs() {
        const path = join(__dirname, '..', 'jobs');
        const files = readdirSync(path).filter(
			(f) => f.endsWith('.js') || f.endsWith('.ts')
		);

        for (const file of files) {
            const { job } = require(resolve(process.cwd(), `${path}/${file}`)) as {
				job: Job;
			};
            this.jobs.set(job.name, job);
        }

        return this;
    }
}
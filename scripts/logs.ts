/**
 * Script to pretty print errors logs from the `error.log` file to the console.
 * It parses each line as a Object and then prints it. To only get the latest `n`
 * errors, pass the number to the script invokation. i.e.
 *
 *   ts-node scripts/logs.ts 6 # to get the last 6 errors
 *
 */

const { readFileSync } = require('node:fs');

let json: string[];

try {
	json = readFileSync('./error.log', 'utf8')
		.split('\n')
		.filter((v: string) => v !== '');
} catch (_e) {
	// File doesnt exist so theres prolly no error logged.
	console.error("File `error.log` doesn't exist. There is no error.");
	process.exit(0);
}
let n = Number(process.argv[2]);

if (isNaN(n) || n > json.length) {
	n = json.length;
}

json
	.reverse()
	.slice(0, n)
	.forEach((v: string) => {
		const r = JSON.parse(v);
		console.log(r);
	});

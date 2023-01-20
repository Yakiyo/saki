import pino from 'pino';

const logger = pino(
	pino.transport({
		target: 'pino/file',
		options: {
			destination: './error.log',
			mkdir: true,
		},
	}),
);

/**
 * Function to log errors to a log file.
 */
export function log(p: unknown) {
	// Set DEBUG env to any value to log stuff
	// in development
	if (process.env.DEBUG) {
		console.error(p);
	}
	logger.error(p);
}

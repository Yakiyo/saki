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
	// Log stuff to console when not in prod
	if (process.env.NODE_ENV !== 'production') {
		console.error(p);
	}
	logger.error(p);
	return null;
}

/**
 * Shorten a string upto num length
 */
export function shorten(str: string, num = 1000): string | undefined {
	if (typeof str !== 'string') return undefined;
	if (str.length > num) {
		return `${str.substring(0, num + 1)}...`;
	} else {
		return str;
	}
}

/**
 * Generate a random number between max and min (both inclusive)
 */
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

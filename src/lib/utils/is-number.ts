/*
	jsrepo 1.36.0
	Installed from github/ieedan/shadcn-svelte-extras
	2-15-2025
*/

/*
	jsrepo 1.19.1
	Installed from github/ieedan/std
	12-11-2024
*/

/** Checks if provided value is actually a number.
 *
 * @param num value to check
 * @returns
 *
 * ## Usage
 *
 * ```ts
 * isNumber("2"); // true
 * isNumber("1.11"); // true
 * isNumber("0xff"); // true
 *
 * isNumber("two"); // false
 * isNumber({ two: 2 }); // false
 * isNumber(Number.POSITIVE_INFINITY); // false
 * ```
 */
export const isNumber = (num: unknown): boolean => {
	if (typeof num === 'number') return num - num === 0;

	if (typeof num === 'string' && num.trim() !== '') return Number.isFinite(+num);

	return false;
};

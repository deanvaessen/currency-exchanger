/*******************************
 * [_generator.js]
 * Define the helper functions for generating things
 ******************************/

/**
 * { Dependencies }
 */

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { content }
	 * Support helpers for content validation
	*/
	const secondsSinceEpochFromDate = input => {

		// Create UTC
		const date = new Date();

		date.setUTCFullYear(input.year);
		date.setUTCMonth(input.month);
		date.setUTCDate(input.day);
		date.setUTCHours(24);
		date.setUTCMinutes(0);
		date.setUTCSeconds(0);

/*		alert(d);                        // -> Sat Feb 28 2004 23:45:26 GMT-0300 (BRT)
		alert(d.toLocaleString());       // -> Sat Feb 28 23:45:26 2004
		alert(d.toLocaleDateString());   // -> 02/28/2004
		alert(d.toLocaleTimeString());   // -> 23:45:26*/
		const secondSinceEpoch = Math.round(date.getTime() / 1000);

		return secondSinceEpoch;
	};

	const colour = input => {
		const letters = '0123456789ABCDEF';
		let colour = '#';

		for (let i = 0; i < 6; i++) {
				colour += letters[Math.floor(Math.random() * 16)];
		}
		return colour;
	};

	return {
		secondsSinceEpochFromDate : secondsSinceEpochFromDate,
		colour : colour
	};
 })();


 /**
	* Export
	*/
 module.exports = index;

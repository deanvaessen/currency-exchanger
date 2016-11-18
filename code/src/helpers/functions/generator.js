/*******************************
 * [_generator.js]
 * Define the helper functions for generating things
 ******************************/

/**
 * { Dependencies }
 */
const clone = require('clone');

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { Generators }
	 *
	*/

	const secondsSinceEpoch = () => {
		const secondSinceEpoch = Math.floor(Date.now() / 1000);

		return secondSinceEpoch;
	};

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

	const colour = () => {
		const letters = '0123456789ABCDEF';
		let colour = '#';

		for (let i = 0; i < 6; i++) {
				colour += letters[Math.floor(Math.random() * 16)];
		}
		return colour;
	};


	const id = (length, range) => {

		if (length == undefined){
			length = 10;
		}

		if (range == undefined){
			range = {
				max : 9,
				min : 1
			};
		}

		const randomID = function (length) {
			return parseInt((Math.random() * range.max + range.min) * Math.pow(10, length - 1), 10);
		};

		let id = randomID(length);

		return id;
	};

	const copyOfArray = array => {
		const clonedArray = clone(array);

		return clonedArray;
	};

	return {
		secondsSinceEpoch : secondsSinceEpoch,
		secondsSinceEpochFromDate : secondsSinceEpochFromDate,
		colour : colour,
		id : id,
		copyOfArray : copyOfArray
	};
 })();


/**
* Export
*/
 module.exports = index;

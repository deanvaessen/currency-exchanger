/* ******************************
 * [communicator.js]
 * This file holds the communication calls for the component. Communication to outside and processing of this data
 *
 * Notes:
 *
 ******************************/

/**
* Dependencies
*/

import helpers from './../../../../helpers/index';

/**
 * Object
 */



let exposed = new class {

	getCurrenciesAndRates(callback){
		helpers.communicate.ajax.get('https://crossorigin.me/http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml', result => {
			callback(helpers.convert.xml.toJSON(result));
		});
	}

	exchange(input, callback) {
		console.log('communicator_postLog: Fire');
		console.log(input);

		helpers.exchange(input, result => {
			callback(result);
		});
	}
};

/**
 * Export
 */
module.exports = exposed;

/* ******************************
 * [communicator.js]
 * This file holds the communication calls for the component to test stream and file logging through NodeJS/Express.
 *
 * Notes:
 *
 ******************************/

/**
* Dependencies
*/

//import helpers from './../../../helpers/index';

/**
 * Object
 */



let exposed = new class {

	grabCurrencies(input){

	}

	exchange(input) {
		console.log('communicator_postLog: Fire');
		console.log(input);

		//const messageOutput = input.messageOutput;



	}
};

/**
 * Export
 */
module.exports = exposed;

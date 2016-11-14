/* ******************************
 * [processor.js]
 * This file hold support code for processing data (like from communicator.js)
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

	processCurrenciesAndRates(input, callback) {
		console.log(input);
		console.log(callback);

		// Draw up some arrays for present day
			let currentCurrencyList = [];
			const XMLArrayToday = input['gesmes:Envelope'].Cube.Cube[0].Cube;

			// Unpack the ugly array that I get back and make my own
			XMLArrayToday.forEach(function (item, index){
				const currencyAndRate = {
					currency : item['@attributes'].currency,
					rate : item['@attributes'].rate
				};

				currentCurrencyList.push(currencyAndRate);
			});

			currentCurrencyList.push({
				currency : 'EUR',
				rate : 1
			});

			const XMLArrayHistory = input['gesmes:Envelope'].Cube.Cube;

		// Draw up some arrays for historical representation
			// Unpack the ugly array that I get back and make my own
			let historicCurrencyList = [];

			// For each array that holds arrays with rates and currencies for a specific time instance
			XMLArrayHistory.forEach(function (item, index){

				const dateStamp = item['@attributes'].time;

				let currencyPeriodSubArray = [];

				// Take all the currencies and rates
				item.Cube.forEach((item, index) => {
					const currencyAndRate = {
						currency : item['@attributes'].currency,
						rate : item['@attributes'].rate
					};

					// Push it into the sub array array
					currencyPeriodSubArray.push(currencyAndRate);

				});

				currencyPeriodSubArray.push({
					currency : 'EUR',
					rate : 1
				});

				// Put it into the main array
				historicCurrencyList.push({
					date : dateStamp,
					currencies : currencyPeriodSubArray
				});
			});

			callback({
				currentCurrencyList : currentCurrencyList,
				historicCurrencyList : historicCurrencyList
			});
	}
};

/**
 * Export
 */
module.exports = exposed;

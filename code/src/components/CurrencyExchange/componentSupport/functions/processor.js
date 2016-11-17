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

import helpers from './../../../../helpers/index';

/**
 * Object
 */



let exposed = new class {

	processCurrenciesAndRates(input, callback) {

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
			let historicCurrencyListAll = [];
			let historicCurrencyListSelected = [];

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

				// Put it into the main arrays
					// The array for the graph with all the currencies (except for Euro)
					historicCurrencyListAll.push({
						date : dateStamp,
						currencies : currencyPeriodSubArray
					});
			});

			// Edit the array for the graph for the selected currencies
			historicCurrencyListSelected = helpers.generate.copyOfArray(historicCurrencyListAll);

			historicCurrencyListSelected.forEach((item, index) => {
				item.currencies.push({
					currency : 'EUR',
					rate : 1
				});
			});

			callback({
				currentCurrencyList : currentCurrencyList,
				historicCurrencyListAll : historicCurrencyListAll,
				historicCurrencyListSelected : historicCurrencyListSelected
			});
	}
};

/**
 * Export
 */
module.exports = exposed;

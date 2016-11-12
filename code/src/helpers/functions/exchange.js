/*******************************
 * [_exchange.js]
 * Define the exchange code here
 ******************************/
 /**
 * { Dependencies }
 */

// General helpers
//import helpers from './../index';


/**
 * { Function }
 */
let exchange = (input, callback) => {

	/**
	 * { Definitions }
	 */

	/**
	 * { Support }
	 * Support functions for main function down the page
	 */

		// Function specific helpers
/*		const helpers = {
			reverse(payload) {
				return payload.reverse();
			},
		};*/


	/**
	* { Main function }
	* Process the input and exchanges the requested currencies
	*/

		// 0.
		console.log(input);

		const followingCurrencyCalculated = function (input) {

			const leadingCurrencyAmount = input.leadingCurrency.amount,
				leadingCurrencyRate = input.leadingCurrency.rate,
				//followingCurrencyAmount = input.leadingCurrency.amount,
				followingCurrencyRate = input.followingCurrency.rate;


			// Calculate to euros
				// value / rate
				const leadingCurrencyInEuros = leadingCurrencyAmount / leadingCurrencyRate;
					// followingCurrencyInEuros = followingCurrencyAmount / followingCurrencyRate;

			console.log(leadingCurrencyInEuros, followingCurrencyRate);
			// Calculate between the currencies
			console.log(leadingCurrencyInEuros * followingCurrencyRate);
			return (leadingCurrencyInEuros * followingCurrencyRate);
		};

		let result = input;

		result.followingCurrency.amount = followingCurrencyCalculated(input);
		callback(result);
};

export default exchange;

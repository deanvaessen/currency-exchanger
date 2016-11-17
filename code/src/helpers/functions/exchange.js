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

	// Sparkles


	/**
	* { Main function }
	* Process the input and exchanges the requested currencies
	*/

		// The function that does the actual calculation
		const followingCurrencyCalculated = function (input) {

			const leadingCurrencyAmount = input.leadingCurrency.amount,
				leadingCurrencyRate = parseFloat(input.leadingCurrency.rate),
				//followingCurrencyAmount = input.leadingCurrency.amount,
				followingCurrencyRate = parseFloat(input.followingCurrency.rate);


			// Calculate to euros
				// value / rate
				const leadingCurrencyInEuros = leadingCurrencyAmount / leadingCurrencyRate;
					// followingCurrencyInEuros = followingCurrencyAmount / followingCurrencyRate;

			// Calculate between the currencies
			return (leadingCurrencyInEuros * followingCurrencyRate);
		};

		let result = input;

		result.followingCurrency.amount = parseFloat(followingCurrencyCalculated(input));

		if (callback){
			callback(result);
		};

		return result;
};

export default exchange;

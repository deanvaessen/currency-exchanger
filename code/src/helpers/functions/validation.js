/*******************************
 * [_validation.js]
 * Define the helper function for misc. validation here
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
	const content = {

		// Check if there are only numbers given (and commas)
		isNumeric : function (input) {
			return !isNaN(parseFloat(input)) && isFinite(input);
		}

		// Illegal chars
			//.match(/[\<\>;:.\^\,]+/i)

	};

	return {
		content : content
	};
 })();


 /**
  * Export
  */
 module.exports = index;

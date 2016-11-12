/*******************************
 * [_mutation.js]
 * Define the helper function for misc. mutatation here
 ******************************/

/**
 * { Dependencies }
 */

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { Typography }
	 * Support helpers for typography
	*/
	const typography = {

		// Support to capitalise a result
		capitaliseFirstLetter : function (input) {
			return input.charAt(0).toUpperCase() + input.slice(1);
		},

		filterSpecificFirstChar : function (input, charFilter) {
			if (input.charAt(0) === charFilter){
				input = input.slice(1, input.length);
			}
			return input;
		},

		filterSpecificLastChar : function (input, charFilter) {
			if (input.charAt(input.length - 1) === charFilter){
				input = input.slice(0, input.length - 1);
			}
			return input;
		},

		removeWhitespace : function (input) {
			return input.replace(/\s/g, '');
		},

		removeWhitespaceDuplicate : function (input) {
			return input.replace(/\s+/g, ' ');
		},

		removeWhitespaceTrailing : function (input) {
			return input.replace(/((\s*\S+)*)\s*/, '$1');
		},

		removeWhitespaceTrailingLeading : function (input) {
			return input.replace(/\s*((\S+\s*)*)/, '$1');
		},

		replaceCommaWithDot : function (input) {
			return input.replace(/,/g, '.');
		}
	};

	return {
		typography : typography
	};
 })();


 /**
  * Export
  */
 module.exports = index;

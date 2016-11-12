/*******************************
 * [_index.js]
 * index file for the helpers
 ******************************/

/**
* { Dependencies }
*/
import MutationHelpers from './functions/mutation';
import ValidationHelpers from './functions/validation';
import CommunicationHelpers from './functions/communication';
import ConversionHelpers from './functions/conversion';
import ExchangeHelpers from './functions/exchange';

/**
* { Function }
*/
const index = (function () {

			/**
			* Support helpers for mutation
			*/
			const mutate = {
				typography : {
					capitaliseFirstLetter : function (input){
						return MutationHelpers.typography.capitaliseFirstLetter(input);
					},
					filterSpecificFirstChar : function (input, charFilter){
						return MutationHelpers.typography.filterSpecificFirstChar(input, charFilter);
					},
					filterSpecificLastChar : function (input, charFilter){
						return MutationHelpers.typography.filterSpecificLastChar(input, charFilter);
					},
					removeWhitespace : function (input){
						return MutationHelpers.typography.removeWhitespace(input);
					},
					removeWhitespaceDuplicate : function (input){
						return MutationHelpers.typography.removeWhitespaceDuplicate(input);
					},
					removeWhitespaceTrailing : function (input){
						return MutationHelpers.typography.removeWhitespaceTrailing(input);
					},
					removeWhitespaceTrailingLeading : function (input){
						return MutationHelpers.typography.removeWhitespaceTrailingLeading(input);
					},
					replaceCommaWithDot : function (input){
						return MutationHelpers.typography.replaceCommaWithDot(input);
					}
				}
			};

			const validate = {
				content : {
					isNumeric : function (input){
						return ValidationHelpers.content.isNumeric(input);
					}
				}
			};

			const communicate = {
				ajax : {
					get : function (url, callback){
						return CommunicationHelpers.ajax.get(url, callback);
					}
				}
			};

			const convert = {
				xml : {
					toJSON : function (input){
						return ConversionHelpers.xml.toJSON(input);
					}
				}
			};

			const exchange = function (input, callback){
				return ExchangeHelpers(input, callback);
			};

			return {
				mutate : mutate,
				validate : validate,
				communicate : communicate,
				convert : convert,
				exchange : exchange
			};
})();


/**
 * Export
 */
module.exports = index;

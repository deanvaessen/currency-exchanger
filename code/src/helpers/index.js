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
				ajax : function (input){
					return CommunicationHelpers.ajax(input);
				}
			};

			return {
				mutate : mutate,
				validate : validate,
				communicate : communicate
			};
})();


/**
 * Export
 */
module.exports = index;

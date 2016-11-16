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
import RenderHelpers from './functions/render';
import GenerationHelpers from './functions/generator';

/**
* { Function }
*/
const index = (function () {

			/**
			* Support helpers for mutation
			*/
			const mutate = {
				typography : {
					capitaliseFirstLetter : (input) => {
						return MutationHelpers.typography.capitaliseFirstLetter(input);
					},
					filterSpecificFirstChar : (input, charFilter) => {
						return MutationHelpers.typography.filterSpecificFirstChar(input, charFilter);
					},
					filterSpecificLastChar : (input, charFilter) => {
						return MutationHelpers.typography.filterSpecificLastChar(input, charFilter);
					},
					removeWhitespace : (input) => {
						return MutationHelpers.typography.removeWhitespace(input);
					},
					removeWhitespaceDuplicate : (input) => {
						return MutationHelpers.typography.removeWhitespaceDuplicate(input);
					},
					removeWhitespaceTrailing : (input) => {
						return MutationHelpers.typography.removeWhitespaceTrailing(input);
					},
					removeWhitespaceTrailingLeading : (input) => {
						return MutationHelpers.typography.removeWhitespaceTrailingLeading(input);
					},
					replaceCommaWithDot : (input) => {
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
					get : (url, callback) => {
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

			const exchange = (input, callback) => {
				return ExchangeHelpers(input, callback);
			};

			const render = {
				graph : function (input){
					return RenderHelpers.graph(input);
				}
			};

			const generate = {
				secondsSinceEpochFromDate : function (input){
					return GenerationHelpers.secondsSinceEpochFromDate(input);
				},

				colour : () => {
					return GenerationHelpers.colour();
				},

				id : () => {
					return GenerationHelpers.id();
				},

				copyOfArray : array => {
					return GenerationHelpers.copyOfArray(array);
				}
			};

			return {
				mutate : mutate,
				validate : validate,
				communicate : communicate,
				convert : convert,
				exchange : exchange,
				render : render,
				generate : generate
			};
})();


/**
 * Export
 */
module.exports = index;

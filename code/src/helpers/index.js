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
import InteractionHelpers from './functions/interaction';
import PolyFillHelpers from './functions/polyfill';

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
				graph : function (input, callback){
					return RenderHelpers.graph(input, callback);
				}
			};

			const generate = {
				secondsSinceEpoch : function (input){
					return GenerationHelpers.secondsSinceEpoch(input);
				},

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

			const interact = {
				disableScrollingTimer : function (input){
					return InteractionHelpers.disableScrollingTimer(input);
				}
			};

			const polyfill = {
				customEvents : function (input){
					return PolyFillHelpers.customEvents(input);
				}
			};

			return {
				mutate : mutate,
				validate : validate,
				communicate : communicate,
				convert : convert,
				exchange : exchange,
				render : render,
				generate : generate,
				interact : interact,
				polyfill : polyfill
			};
})();


/**
 * Export
 */
module.exports = index;

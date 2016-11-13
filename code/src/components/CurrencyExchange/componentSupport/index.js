/*******************************
 * [_index.js]
 * index file for the componentFunctions
 ******************************/

/**
* { Dependencies }
*/
import communicator from './functions/communicator';
import processor from './functions/processor';
import handler from './functions/handler';

/**
* { Function }
*/
const index = (function () {


			const handle = {
				submit : (formStatus, fields) => {
					return handler.submit(formStatus, fields);
				},

				keyUp : (name, e) => {
					return handler.KeyUp(name, e);
				},

				onChangeDropdown : (name, e) => {
					return handler.onChangeDropdown(name, e);
				},

				mockEvent : (obj, event) => {
					return handler.mockEvent(obj, event);
				}
			};

			const communicate = {

				getCurrenciesAndRates : callback => {
					return communicator.getCurrenciesAndRates(callback);
				},

				exchange : (input, callback) => {
					return communicator.exchange(input, callback);
				}

			};

			const process = {
				processCurrenciesAndRates : (input, callback) => {
					return processor.processCurrenciesAndRates(input, callback);
				}
			};

			return {
				handle : handle,
				communicate : communicate,
				process : process
			};
})();


/**
 * Export
 */
module.exports = index;

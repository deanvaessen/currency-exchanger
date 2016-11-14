/* ******************************
 * [handle.js]
 * This file holds event handling support code
 *
 * Notes:
 *
 ******************************/

/**
* Dependencies
*/
import helpers from './../../../../helpers/index';
import communicator from './communicator';

//const removeWhitespace = helpers.mutate.typography.removeWhitespace;

/**
 * Object
 */

let exposed = new class {

	// onChange radiobuttons logLocationLookIn
	onChangeDropdown(name, e) {
		this.setState({ [name] : e.target.value});

		// Show the 'Amount X of Currency X equals amount Y of currency Y'
		this.shouldHideWrittenOutcome = false;

	}

	mockEvent(obj, event) {
		const mockedEvent = new Event(event, {target : obj, bubbles : true});

		return obj ? obj.dispatchEvent(mockedEvent) : false;
	}

	submit(formStatus, fields) {
		console.log(this.state);
		// Get state and run some filters and tests
		const leadingCurrencySelector = this.state.leadingCurrency,
			leadingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? this.state.selectCurrencyA : this.state.selectCurrencyB),
			leadingCurrencyValue = (leadingCurrencySelector === 'valueCurrencyA' ? fields.currencyA.value : fields.currencyB.value),
			followingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? this.state.selectCurrencyB : this.state.selectCurrencyA),
			followingCurrencyValue = (leadingCurrencySelector === 'valueCurrencyA' ? fields.currencyB.value : fields.currencyA.value);

			let leadingCurrencyFiltered,
			followingCurrencyFiltered,
			leadingCurrencyRate,
			followingCurrencyRate;

			leadingCurrencyFiltered = helpers.mutate.typography.removeWhitespace(leadingCurrencyValue);
			leadingCurrencyFiltered = helpers.mutate.typography.replaceCommaWithDot(leadingCurrencyValue);

			followingCurrencyFiltered = helpers.mutate.typography.removeWhitespace(followingCurrencyValue);
			followingCurrencyFiltered = helpers.mutate.typography.replaceCommaWithDot(followingCurrencyValue);

			const isNumeric = helpers.validate.content.isNumeric(leadingCurrencyFiltered);

		if (!formStatus.touched && (leadingCurrencyFiltered == '') && (followingCurrencyFiltered === '')) {
			return;
		}

		if (!isNumeric) {
			return;
		}

		// No errors found, continue.

		// Find the appropriate rates

		this.state.currentCurrencyList.forEach((item, index) => {
			if (item.currency == leadingCurrency){
				leadingCurrencyRate = item.rate;
			}

			if (item.currency == followingCurrency){
				followingCurrencyRate = item.rate;
			}
		});

		// Define an exchange request
		// Only 1 currency can be 'leading', that is to say;
			// If I input '20usd' then it should calculate this number to the OTHER currency still select it
			// To do that, it should overwrite the old value

			const exchangeObject = {
				leadingCurrency : {
					currency : leadingCurrency,
					amount : parseFloat(leadingCurrencyFiltered),
					rate : parseFloat(leadingCurrencyRate)
				},
				followingCurrency : {
					currency : followingCurrency,
					amount : parseFloat(followingCurrencyFiltered),
					rate : parseFloat(followingCurrencyRate)
				}
			};

			// Fire off an exchange request
			communicator.exchange(exchangeObject, (result) => this.mutateComponent(result));
	}

	keyUp(name, e) {
		if (e.key === 'Enter') {
			// Prevent enter key, Formous doesn't seem to like the enter key
			e.preventDefault();
		} else {

		}
	}
};

/**
 * Export
 */
module.exports = exposed;

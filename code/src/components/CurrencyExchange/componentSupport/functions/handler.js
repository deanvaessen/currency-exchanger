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

	/**
	* { onChange radiobuttons logLocationLookIn }
	*
	*/
	onChangeDropdown(name, e) {
		this.setState({ [name] : e.target.value});
		this.setState({ currencyHasChanged : true});
	}

	/**
	* { Event mocking }
	* E.g: to trigger an input
	*/
	mockEvent(obj, event) {
		const mockedEvent = new CustomEvent(event, {target : obj, bubbles : true});

		return obj ? obj.dispatchEvent(mockedEvent) : false;
	}

	/**
	* { Process the input of amount }
	*
	*/
	changeCurrencyAmount(name, value) {
		this.setState({leadingCurrency : value});

		// Mock an event so that formous knows which the leadingCurrency is
		const elID = 'CurrencyExchange__formousTestLeadingCurrency';
		const leadingRecorder = document.getElementById(elID);

		name = name.charAt(0).toUpperCase() + name.slice(1);

		leadingRecorder.value = name;

		this.setState({ currencyHasChanged : true});
		exposed.mockEvent(leadingRecorder, 'input');
	}

	/**
	* { Handler for form submission }
	*
	*/
	submit(formStatus, fields) {

		/**
		* { Filter & State }
		* Get state and run some filters and tests to find and fix issues
		*/

		// Definitions
			const leadingCurrencySelector = this.state.leadingCurrency,
				stateA = this.state.selectCurrencyA,
				stateB = this.state.selectCurrencyB,
				leadingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? stateA : stateB),
				leadingCurrencyValue = (leadingCurrencySelector === 'valueCurrencyA' ? fields.currencyA.value : fields.currencyB.value),
				followingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? stateB : stateA),
				followingCurrencyValue = (leadingCurrencySelector === 'valueCurrencyA' ? fields.currencyB.value : fields.currencyA.value),
				currencyHasChanged = this.state.currencyHasChanged;

				let leadingCurrencyFiltered,
				followingCurrencyFiltered,
				leadingCurrencyRate,
				followingCurrencyRate;

				leadingCurrencyFiltered = helpers.mutate.typography.removeWhitespace(leadingCurrencyValue);
				leadingCurrencyFiltered = helpers.mutate.typography.replaceCommaWithDot(leadingCurrencyValue);
				leadingCurrencyFiltered = parseFloat(leadingCurrencyFiltered);

				followingCurrencyFiltered = helpers.mutate.typography.removeWhitespace(followingCurrencyValue);
				followingCurrencyFiltered = helpers.mutate.typography.replaceCommaWithDot(followingCurrencyValue);
				followingCurrencyFiltered = parseFloat(followingCurrencyFiltered);

				const isNumeric = helpers.validate.content.isNumeric(leadingCurrencyFiltered);

		// Submition filters
			if (!formStatus.touched && (leadingCurrencyFiltered == '') && (followingCurrencyFiltered === '')) {
				return;
			}

			if (!isNumeric) {
				return;
			}

			if (!currencyHasChanged) {
				return;
			}

			if (fields.currencyA.value == '' && fields.currencyB.value == ''){
				return;
			}

		// No errors found, continue.

		/**
		* { Change the view }
		*
		*/
		// Show the results block in the view
		this.shouldHideWrittenOutcome = false;

		this.setState({ currencyHasChanged : false});


		/**
		* { Start handling the currencies }
		*
		*/
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
						amount : leadingCurrencyFiltered,
						rate : leadingCurrencyRate
					},
					followingCurrency : {
						currency : followingCurrency,
						amount : followingCurrencyFiltered,
						rate : followingCurrencyRate
					}
				};

		// Fire off an exchange request
			communicator.exchange(exchangeObject, (result) => {
				result.followingCurrency.amount = result.followingCurrency.amount.toFixed(2);

				this.mutateComponent(result);
			});


			/**
			 * { Draw the historic graph of selected currencies }
			 * Call the draw for the history graph of the currencies that are selected by the user
			*/

			let historicCurrencyListSelected = helpers.generate.copyOfArray(this.state.historicCurrencyListSelected);

			// Throw out all the currencies we don't need
				//For each date
				historicCurrencyListSelected.forEach((item, index) => {
					let removeFromArrayIndexes = [];

					// Throw out the currencies we don't need
					item.currencies.forEach((item, index) => {
						if (item.currency !== followingCurrency && item.currency !== leadingCurrency) {

								removeFromArrayIndexes.push(index);

						} else {
						}
					});

					for (let i = removeFromArrayIndexes.length - 1; i >= 0; i--){
						item.currencies.splice(removeFromArrayIndexes[i], 1);
					}
				});

			// Now updated the rates of the currency (but not if it leading and following are equal because then take Euro rate (default))
				if (leadingCurrency !== followingCurrency) {
					let exchangeObjectSelected = {
						leadingCurrency : {
							currency : leadingCurrency,
							amount : 1,
							rate : null
						},
						followingCurrency : {
							currency : followingCurrency,
							amount : 1,
							rate : null
						}
					};

					historicCurrencyListSelected.forEach((item, index) => {
						item.currencies.forEach((item, index) => {

							if (item.currency == leadingCurrency) {
								exchangeObjectSelected.leadingCurrency.rate = item.rate;
							} else if (item.currency == followingCurrency) {
								exchangeObjectSelected.followingCurrency.rate = item.rate;
							}

							communicator.exchange(exchangeObjectSelected, (result) => {
								item.rate = result.followingCurrency.amount;
							});
						});
					});
				}

			// Throw out the leadingCurrency because we don't need it for the graph
				//For each date
				historicCurrencyListSelected.forEach((item, index) => {
					let removeFromArrayIndexes = [];

					// Throw out the currencies we don't need
					item.currencies.forEach((item, index) => {
						if (item.currency != followingCurrency) {
								removeFromArrayIndexes.push(index);
						} else {
						}
					});

					for (let i = removeFromArrayIndexes.length - 1; i >= 0; i--){
						item.currencies.splice(removeFromArrayIndexes[i], 1);
					}
				});

			// Call a render
				const graphHistorySelected = {
					lineArray : historicCurrencyListSelected,
					lineColours : {
						state : this.state.historicCurrencyListSelectedColours,
						stateKey : 'historicCurrencyListSelectedColours'
					},
					elements : {
						axes : {
							y : [
								'chartHistorySelected__yAxis0'
							]
						},
						chart : '#chartHistorySelected',
						smoothing : 'chartHistorySelected__smoother',
						legend : {
							container : 'chartHistorySelected__legendContainer',
							legend : 'chartHistorySelected__legend'
						},
						slider : 'chartHistorySelected__slider'
					},
					attributes : {
						height : 300
					}
				};

				communicator.drawGraphAndAddListeners(this, graphHistorySelected);
	}
};

/**
 * Export
 */
module.exports = exposed;

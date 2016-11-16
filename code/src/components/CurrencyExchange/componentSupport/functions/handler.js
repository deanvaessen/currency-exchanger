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
		this.setState({ currencyHasChanged : true});

		// Show the 'Amount X of Currency X equals amount Y of currency Y'
		//this.shouldHideWrittenOutcome = false;

	}

	mockEvent(obj, event, self) {
		const mockedEvent = new Event(event, {target : obj, bubbles : true});

		return obj ? obj.dispatchEvent(mockedEvent) : false;
	}

	submit(formStatus, fields) {
		//console.log(this.state);
		// Show the results block in the view
		this.shouldHideWrittenOutcome = false;
		// Get state and run some filters and tests to find and fix issues
		const leadingCurrencySelector = this.state.leadingCurrency,
			leadingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? this.state.selectCurrencyA : this.state.selectCurrencyB),
			leadingCurrencyValue = (leadingCurrencySelector === 'valueCurrencyA' ? fields.currencyA.value : fields.currencyB.value),
			followingCurrency = (leadingCurrencySelector === 'valueCurrencyA' ? this.state.selectCurrencyB : this.state.selectCurrencyA),
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

		if (!formStatus.touched && (leadingCurrencyFiltered == '') && (followingCurrencyFiltered === '')) {
			return;
		}

		if (!isNumeric) {
			return;
		}

		if (!currencyHasChanged) {
			return;
		}

		this.setState({ currencyHasChanged : false});

		console.log(followingCurrencyValue);

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
			 * { Historic graph, selected currencies }
			 * Call the draw for the history graph of the currencies that are selected by the user
			*/
			/*eslint-disable */

			let historicCurrencyListSelected = helpers.generate.copyOfArray(this.state.historicCurrencyListSelected);
			//console.log(historicCurrencyListSelected);

			// Throw out all the currencies we don't need
				//For each date
				historicCurrencyListSelected.forEach((item, index) => {
					const dateIndex = index;
					let removeFromArrayIndexes = [];

					// Throw out the currencies we don't need
					item.currencies.forEach((item, index) => {
						if (item.currency !== followingCurrency && item.currency !== leadingCurrency) {
							//console.log('removing', item.currency);
								//historicCurrencyListSelected[dateIndex].currencies.splice(index, 1);

								removeFromArrayIndexes.push(index);
								//console.log(index)

						} else {
							//console.log(item, index, followingCurrency);
						}
					});

					for (let i = removeFromArrayIndexes.length -1; i >= 0; i--){
					   item.currencies.splice(removeFromArrayIndexes[i],1);
					}
				});

			//console.log(historicCurrencyListSelected);
			// Now updated the rates of the currency (but not if it leading and following are equal because then take Euro rate (default))
			console.log(leadingCurrency !== followingCurrency);
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

				//console.log('hey');
				console.log(historicCurrencyListSelected);
				historicCurrencyListSelected.forEach((item, index) => {
					item.currencies.forEach((item, index) => {
						//console.log(item.currency, leadingCurrency)
						//console.log(item.rate)

						if (item.currency == leadingCurrency) {
							exchangeObjectSelected.leadingCurrency.rate = item.rate;
							console.log('leading!');
							console.log(item.rate);
						} else if (item.currency == followingCurrency) {
							console.log('following!');
							console.log(item.rate);
							exchangeObjectSelected.followingCurrency.rate = item.rate;
						}

						console.log(exchangeObject);

						communicator.exchange(exchangeObjectSelected, (result) => {
							console.log('deaaaaaaaaaaaaaaaaan');
							console.log(result.followingCurrency.amount);
							item.rate = result.followingCurrency.amount;
							//historicCurrencyListSelected[dateIndexSelected].currencies[index].rate = result.followingCurrency.amount;
						});
					});
				});
			}
							//console.log(result.followingCurrency.amount);

			// Throw out the leadingCurrency because we don't need it for the graph
				//For each date
				historicCurrencyListSelected.forEach((item, index) => {
					const dateIndex = index;
					let removeFromArrayIndexes = [];

					// Throw out the currencies we don't need
					item.currencies.forEach((item, index) => {
						if (item.currency != followingCurrency) {
								removeFromArrayIndexes.push(index);
						} else {
						}
					});

					for (let i = removeFromArrayIndexes.length -1; i >= 0; i--){
					   item.currencies.splice(removeFromArrayIndexes[i],1);
					}
				});

			console.log(historicCurrencyListSelected);

			// Call a render
			const graphHistorySelected = {
				lineArray : historicCurrencyListSelected,
				elements : {
					axes : {
						y : [
							'chartHistorySelected__yAxis0',
							'chartHistorySelected__yAxis1'
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
					height : 300,
					clearPrevious : true
				}
			};


			helpers.render.graph(graphHistorySelected);
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

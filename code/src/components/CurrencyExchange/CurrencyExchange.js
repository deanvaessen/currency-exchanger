/*******************************
 * [_CurrencyExchange.js]
 * Define the CurrencyExchange code here
 ******************************/

/* eslint react/prop-types: 0 */

/**
* { Dependencies }
*/

require('./CurrencyExchange.scss');
require('./RickshawHistoryAll.scss');
require('./RickshawHistorySelected.scss');
require('./RickshawShared.scss');

import React from 'react';
import Formous from 'formous';

import helpers from './../../helpers/index';
import componentFunctions from './componentSupport/index';
import handle from './componentSupport/functions/handler';


/**
 * { Component }
 */

class ErrorText extends React.Component {
	render() {
		return <div style={{color : '#f00' }}>
					{this.props.errorText}
				</div>;
	}
 }

 ErrorText.propTypes = {
	// errorText : React.PropTypes.string
	// Prop validation is already done through Formous
};

class CurrencyExchange extends React.Component {
	constructor(props) {
		super(props);
		// Handlers
			this.handleSubmit = handle.submit.bind(this);
			this.handleKeyUp = handle.keyUp.bind(this);
			this.mutateComponent = this.mutateComponent.bind(this);
			this.onChangeDropdown = handle.onChangeDropdown.bind(this);
			this.changeCurrencyAmount = handle.changeCurrencyAmount.bind(this);
			this.mapCurrencies = this.mapCurrencies.bind(this);
			this.mockEvent = componentFunctions.handle.mockEvent.bind(this);

		// Interaction
		this.stopScroll = helpers.interact.disableScrollingTimer;

		// Vars
		this.shouldHideWrittenOutcome = true;

		// State
		this.state = {
			selectCurrencyA : 'USD',
			selectCurrencyB : 'USD',
			leadingCurrency : '',
			currentCurrencyList : [],
			currencyHasChanged : true,
			historicCurrencyListAll : [],
			historicCurrencyListSelected : [],
			resultCurrencyExchange : '', //remove this one
			resultCurrencyExchangeA : '',
			resultCurrencyExchangeB : '',
			shouldHideWrittenOutcome : true,
			result : {
				leadingCurrency : '',
				leadingCurrencyValue : '',
				followingCurrency : '',
				followingCurrencyValue : ''
			}
		};
	}

	componentWillMount() {
		// Get all the curencies and rates and process them, then draw the history map also
		// This could be a bit cleaner with a promise chain
			//Get rates
			componentFunctions.communicate.getCurrenciesAndRates(currenciesAndRates => {
				//Process rates
				componentFunctions.process.processCurrenciesAndRates(currenciesAndRates, processedCurrenciesAndRates => {

						const historicCurrencyListAll = processedCurrenciesAndRates.historicCurrencyListAll,
							historicCurrencyListSelected = processedCurrenciesAndRates.historicCurrencyListSelected,
							currentCurrencyList = processedCurrenciesAndRates.currentCurrencyList;


						// Update the state so the app knows the currencies
						this.setState({currentCurrencyList : currentCurrencyList});
						this.setState({historicCurrencyListAll : historicCurrencyListAll});
						this.setState({historicCurrencyListSelected : historicCurrencyListSelected});

						//console.log(historicCurrencyListSelected);

						/**
						 * { Historic graph, all currencies }
						 * Call the draw for the history graph of all currencies
						*/
						const graphHistoryAll = {
							lineArray : historicCurrencyListAll,
							elements : {
								axes : {
									y : [
										'chartHistoryAll__yAxis0',
										'chartHistoryAll__yAxis1',
										'chartHistoryAll__yAxis2',
										'chartHistoryAll__yAxis3',
										'chartHistoryAll__yAxis4'
									]
								},
								chart : '#chartHistoryAll',
								smoothing : 'chartHistoryAll__smoother',
								legend : {
									container : 'chartHistoryAll__legendContainer',
									legend : 'chartHistoryAll__legend'
								},
								slider : 'chartHistoryAll__slider'
							},
							attributes : {
								height : 500,
								clearPrevious : false
							}
						};

					helpers.render.graph(graphHistoryAll);
				});
			});
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {
	}

	mapCurrencies(currency){
		//console.log(currency);
		return <option key={helpers.generate.id()}>{currency.currency}</option>;
	}

	mutateComponent(payload, stateObject){
		console.log('CurrencyExchange receives result:');
		console.log(payload);

		// Define the view data
		const leadingCurrency = payload.leadingCurrency.currency,
			leadingCurrencyAmount = payload.leadingCurrency.amount,
			followingCurrency = payload.followingCurrency.currency,
			followingCurrencyAmount = payload.followingCurrency.amount;

		// Pass back into the view
		this.setState({
			result : {
				leadingCurrency : leadingCurrency,
				leadingCurrencyAmount : leadingCurrencyAmount,
				followingCurrency : followingCurrency,
				followingCurrencyAmount : followingCurrencyAmount
			}
		});
	}

	render() {

		/*eslint-disable */
		const {
			fields : { currencyA, currencyB, resultCurrencyExchange, formousTestLeadingCurrency },
			formSubmit
		} = this.props;
		/*eslint-enable */

		const messageA = 'You selected ' + this.state.selectCurrencyA,
			messageB = 'You selected ' + this.state.selectCurrencyB;

		//const testvar = this;

		return (
		<div className="CurrencyExchange__outerContainer">
			<div className="CurrencyExchange__title"><h1>Exchange me, please</h1></div>
			<div className="CurrencyExchange__innerContainer">

				<form onSubmit={formSubmit(this.handleSubmit, event)}>
					<div className="CurrencyExchange__form">
						<div className="CurrencyExchange__input">
							<div className="CurrencyExchange__logMessage" >
								<h4 className="header">Select a currency and input a value</h4>

								<br />

								<div className="CurrencyExchange__LevelAndOutput">
									<div className="CurrencyExchange__logLevel">
										<h4 className="header">Currency A</h4>
										<div className="CurrencyExchange__optionsContainer">
											<div className="CurrencyExchange__currencyOption">
												<div className="CurrencyExchange__valueDropDown">
													<select
														value={this.state.selectCurrencyA}
														onChange={this.onChangeDropdown.bind(this, 'selectCurrencyA')}
														onMouseUp={formSubmit(this.handleSubmit)}
													>
														{this.state.currentCurrencyList.map(this.mapCurrencies)}
													</select>
												</div>

												<div className="CurrencyExchange__currencyAmount">
													<input
														placeholder="How much?"
														type="text"
														ref="CurrencyExchange__inputLogMessage"
														className="CurrencyExchange__inputLogMessage"
														value={currencyA.value}
														onKeyDown={(event) => {

															this.setState({leadingCurrency : 'valueCurrencyA'});

															// Mock an event so that formous knows which the leadingCurrency is
															const elID = 'CurrencyExchange__formousTestLeadingCurrency';
															const leadingRecorder = document.getElementById(elID);

															leadingRecorder.value = 'currencyA';
															this.setState({ currencyHasChanged : true});
															this.mockEvent(leadingRecorder, 'input');

															//event.preventDefault();
															//this.changeCurrencyAmount('currencyA', 'valueCurrencyA');
														}}
														onKeyUp={formSubmit(this.handleSubmit)}
														{ ...currencyA.events }
													/>
													<p>{messageA}</p>
													<ErrorText { ...currencyA.failProps } />
												</div>
											</div>
										</div>
									</div>

									<div className="CurrencyExchange__logOutput">
									<span className="arrow"></span>
										<h4 className="header">Currency B</h4>
										<div className="CurrencyExchange__optionsContainer">
											<div className="CurrencyExchange__currencyOption">
												<div className="CurrencyExchange__valueDropDown">
													<select
														value={this.state.selectCurrencyB}
														onChange={this.onChangeDropdown.bind(this, 'selectCurrencyB')}
														onMouseUp={formSubmit(this.handleSubmit)}
													>
														{this.state.currentCurrencyList.map(this.mapCurrencies)}
													</select>
												</div>

												<div className="CurrencyExchange__currencyAmount">
													<input
														placeholder="How much?"
														type="text"
														ref="CurrencyExchange__inputLogMessage"
														className="CurrencyExchange__inputLogMessage"
														value={currencyB.value}
														onKeyDown={(event) => {
															this.setState({leadingCurrency : 'valueCurrencyB'});

															// Mock an event so that formous knows which the leadingCurrency is
															const elID = 'CurrencyExchange__formousTestLeadingCurrency';
															const leadingRecorder = document.getElementById(elID);

															leadingRecorder.value = 'currencyB';
															this.setState({ currencyHasChanged : true});
															this.mockEvent(leadingRecorder, 'input');

														}}
														onKeyUp={
															formSubmit(this.handleSubmit)
														}
														{ ...currencyB.events }
													/>
													<p>{messageB}</p>
													<ErrorText { ...currencyB.failProps } />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="CurrencyExchange__buttons">
								<button className="CurrencyExchange__clear" type="button" onClick=
								{(event) => {
									this.shouldHideWrittenOutcome = true;
									this.props.clearForm();
								}}>Clear</button>
							</div>

							<hr className={this.shouldHideWrittenOutcome ? 'hidden' : ''} />

							<div className={this.shouldHideWrittenOutcome ? 'hidden' : 'CurrencyExchange__resultCurrencyExchange'}>
								<h4 className={this.shouldHideWrittenOutcome ? 'hidden header' : 'header'}>
									Your exchange conversion:
								</h4>
								<br />

								<div className='CurrencyExchange__outputResultCurrencyExchange'>
									<p className="indent">
										{this.state.result.leadingCurrencyAmount} {this.state.result.leadingCurrency}
										&nbsp;
										equals
										&nbsp;
										{this.state.result.followingCurrencyAmount} {this.state.result.followingCurrency}
									</p>
								</div>
							</div>

							<div className='CurrencyExchange__resultCurrencyExchange'>

								<div className={this.shouldHideWrittenOutcome ? 'hidden' :
								'CurrencyExchange__outputResultCurrencyExchange'}>
									<h4>
										{
											this.state.result.followingCurrency === this.state.result.leadingCurrency ?
												'Historic exchange rate of the' + ' ' + this.state.result.followingCurrency
												+ ' ' + 'against the' + ' ' + 'Euro'
												:
												'Historic exchange rate of the' + ' ' + this.state.result.followingCurrency
												+ ' ' + 'against the' + ' ' + this.state.result.leadingCurrency
										}
									</h4>

									<div id="CurrencyExchange__historyChartSelected" className="CurrencyExchange__resultbox indent">
										<div id="chartHistorySelected__yAxis0"></div>
										<div id="chartHistorySelected"></div>
										<div id="chartHistorySelected__legendContainer">
											<div id="chartHistorySelected__smoother" title="Smoothing"></div>
											<div id="chartHistorySelected__legend"></div>
										</div>
										<div id="chartHistorySelected__slider"></div>
									</div>
								</div>

								<div className='CurrencyExchange__outputResultCurrencyExchange'>
									<h4>
										Historical exchange rates of all currencies against the Euro
									</h4>

									<div id="CurrencyExchange__historyChartAll" className="CurrencyExchange__resultbox indent">
										<div id="chartHistoryAll__yAxis4"></div>
										<div id="chartHistoryAll__yAxis3"></div>
										<div id="chartHistoryAll__yAxis2"></div>
										<div id="chartHistoryAll__yAxis1"></div>
										<div id="chartHistoryAll__yAxis0"></div>
										<div id="chartHistoryAll"></div>
										<div id="chartHistoryAll__legendContainer">
											<div id="chartHistoryAll__smoother" title="Smoothing"></div>
											<div id="chartHistoryAll__legend"></div>
										</div>
										<div id="chartHistoryAll__slider"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
						<input
							placeholder="You shouldn't be seeing me!"
							type="text"
							ref="CurrencyExchange__formousTestLeadingCurrency"
							id="CurrencyExchange__formousTestLeadingCurrency"
							className="hidden"
							value={formousTestLeadingCurrency.value}
							{ ...formousTestLeadingCurrency.events }
						/>
				</form>
			</div>
		</div>
		);
	}
};

CurrencyExchange.propTypes = {
	// Prop validation is already done through Formous
};

const formousOptions = {
	fields : {
		currencyA : {
			tests : [
				{
					critical : true,
					failProps : {
						errorText : 'Could you give me a valid numeric amount?'
					},
					test(value, fields) {

						if (fields.currencyA || fields.currencyB){
							const thisCurrency = 'currencyA',
							otherCurrency = 'currencyB',
							otherValue = fields[otherCurrency].value;

							let filteredValue, filteredValueOther;

							filteredValue = helpers.mutate.typography.removeWhitespace(value);
							filteredValue = helpers.mutate.typography.replaceCommaWithDot(value);

							filteredValueOther = helpers.mutate.typography.removeWhitespace(otherValue);
							filteredValueOther = helpers.mutate.typography.replaceCommaWithDot(otherValue);


							// First we check which the leading currency is so that we know if we can disregard this test or not
							const leadingCurrency = fields.formousTestLeadingCurrency.value;

							if (leadingCurrency === otherCurrency){
								return true; // pass, this field value is not important because the other currency is leading
											// this means that this currency's value is disregarded and overwritten
							} else if (leadingCurrency === thisCurrency) {
								// Did you input a proper numeric value?
								const isNumeric = helpers.validate.content.isNumeric(filteredValue);
								const otherIsNumeric = helpers.validate.content.isNumeric(otherValue);

								if ((filteredValue == '' || !isNumeric) && (filteredValueOther == '' || !otherIsNumeric)) {
									return false;
								}
								return true;
							}
						}
					}
				}
			]
		},
		currencyB : {
			tests : [
				{
					critical : true,
					failProps : {
						errorText : 'Could you give me a valid numeric amount?'
					},
					test(value, fields) {
						if (fields.currencyA || fields.currencyB){
							const thisCurrency = 'currencyB',
							otherCurrency = 'currencyA',
							otherValue = fields[otherCurrency].value;

							let filteredValue, filteredValueOther;

							filteredValue = helpers.mutate.typography.removeWhitespace(value);
							filteredValue = helpers.mutate.typography.replaceCommaWithDot(value);

							filteredValueOther = helpers.mutate.typography.removeWhitespace(otherValue);
							filteredValueOther = helpers.mutate.typography.replaceCommaWithDot(otherValue);

							// First we check which the leading currency is so that we know if we can disregard this test or not
							const leadingCurrency = fields.formousTestLeadingCurrency.value;

							if (leadingCurrency === otherCurrency){
								return true; // pass, this field value is not important because the other currency is leading
											// this means that this currency's value is disregarded and overwritten
							} else if (leadingCurrency === thisCurrency) {
								// Did you input a proper numeric value?
								const isNumeric = helpers.validate.content.isNumeric(filteredValue);
								const otherIsNumeric = helpers.validate.content.isNumeric(otherValue);

								if ((filteredValue == '' || !isNumeric) && (filteredValueOther == '' || !otherIsNumeric)) {
									return false;
								}
								return true;
							}
						}
					}
				}
			]
		},
		formousTestLeadingCurrency : {
			tests : [
				{
					critical : false,
					failProps : {
						errorText : 'N/A'
					},
					test(value) {
						return true;
					}
				}
			]
		}
	}
};

export default Formous(formousOptions)(CurrencyExchange);

/*if (helpers.mutate.typography.removeWhitespace(value) == ''){
	return false;
}
return true;*/

/*******************************
 * [_CurrencyExchange.js]
 * Define the CurrencyExchange code here
 ******************************/

/* eslint react/prop-types: 0 */

/**
* { Dependencies }
*/

require('./CurrencyExchange.scss');
require('./Rickshaw.scss');

import React from 'react';
import Formous from 'formous';

import helpers from './../../helpers/index';
import componentFunctions from './componentSupport/index';


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
			this.handleSubmit = componentFunctions.handle.submit.bind(this);
			this.handleKeyUp = componentFunctions.handle.keyUp.bind(this);
			this.mutateComponent = this.mutateComponent.bind(this);
			this.onChangeDropdown = componentFunctions.handle.onChangeDropdown.bind(this);
			this.mapCurrencies = this.mapCurrencies.bind(this);
			this.mockEvent = componentFunctions.handle.mockEvent.bind(this);

		// Vars
		this.shouldHideWrittenOutcome = true;

		// State
		this.state = {
			selectCurrencyA : 'USD',
			selectCurrencyB : 'USD',
			leadingCurrency : '',
			currentCurrencyList : [],
			historicCurrencyList : [],
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
						console.log(processedCurrenciesAndRates);

						const historicCurrencyList = processedCurrenciesAndRates.historicCurrencyList,
							currentCurrencyList = processedCurrenciesAndRates.currentCurrencyList;

						// Update the state so the app knows the currencies
						this.setState({currentCurrencyList : currentCurrencyList});
						this.setState({historicCurrencyList : historicCurrencyList});

						// Call the draw for the history graph
						const graphObject = {
							element : '#chart',
							lineArray : historicCurrencyList
						};

						helpers.render.graph(graphObject);
				});
			});
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {
	}

	mapCurrencies(currency){
		return <option>{currency.currency}</option>;
	}

	mutateComponent(payload, stateObject){
		console.log('CurrencyExchange receives result:');
		console.log(payload);

		// Show the results block in the view
		this.shouldHideWrittenOutcome = false;

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

		return (
		<div className="CurrencyExchange__outerContainer">
			<div className="CurrencyExchange__title"><h1>Exchange me, please</h1></div>
			<div className="CurrencyExchange__innerContainer">

				<form onSubmit={formSubmit(this.handleSubmit)}>
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
															console.log();
															this.setState({leadingCurrency : 'valueCurrencyA'});
															// Mock an event so that formous knows which the leadingCurrency is
															const elID = 'CurrencyExchange__formousTestLeadingCurrency';
															const leadingRecorder = document.getElementById(elID);

															leadingRecorder.value = 'currencyA';
															this.mockEvent(leadingRecorder, 'input');
														}}
														onKeyUp={
															formSubmit(this.handleSubmit)
														}
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
									<br />
									<br />


									<br />
									<br />
								</div>
							</div>

							<hr className={this.shouldHideWrittenOutcome ? 'hidden' : ''} />

							<div className={this.shouldHideWrittenOutcome ? 'hidden' : 'CurrencyExchange__resultCurrencyExchange'}>
								<h4 className={this.shouldHideWrittenOutcome ? 'hidden header' : 'header'}>
									Your exchange conversion:
								</h4>
								<br />

								<div className='CurrencyExchange__outputresultCurrencyExchange'>
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
								<h4>
									Historical exchange rate
								</h4>
								<div className='CurrencyExchange__outputresultCurrencyExchange'>
									<div id="CurrencyExchange__historyChart" className="CurrencyExchange__resultbox indent">
										<div id="axis4"></div>
										<div id="axis3"></div>
										<div id="axis2"></div>
										<div id="axis1"></div>
										<div id="axis0"></div>
										<div id="chart"></div>
										<div id="legend_container">
											<div id="smoother" title="Smoothing"></div>
											<div id="legend"></div>
										</div>
										<div id="slider"></div>
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
							otherCurrency = 'currencyB';

							let filteredValue;

							filteredValue = helpers.mutate.typography.removeWhitespace(value);
							filteredValue = helpers.mutate.typography.replaceCommaWithDot(value);


							// First we check which the leading currency is so that we know if we can disregard this test or not
							const leadingCurrency = fields.formousTestLeadingCurrency.value;

							if (leadingCurrency === otherCurrency){
								return true; // pass, this field value is not important because the other currency is leading
											// this means that this currency's value is disregarded and overwritten
							} else if (leadingCurrency === thisCurrency) {
								// Did you input a proper numeric value?
								const isNumeric = helpers.validate.content.isNumeric(filteredValue);

								if (filteredValue == '' || !isNumeric) {
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
							otherCurrency = 'currencyA';

							let filteredValue;

							filteredValue = helpers.mutate.typography.removeWhitespace(value);
							filteredValue = helpers.mutate.typography.replaceCommaWithDot(value);


							// First we check which the leading currency is so that we know if we can disregard this test or not
							const leadingCurrency = fields.formousTestLeadingCurrency.value;

							if (leadingCurrency === otherCurrency){
								return true; // pass, this field value is not important because the other currency is leading
											// this means that this currency's value is disregarded and overwritten
							} else if (leadingCurrency === thisCurrency) {
								// Did you input a proper numeric value?
								const isNumeric = helpers.validate.content.isNumeric(filteredValue);

								if (filteredValue == '' || !isNumeric) {
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

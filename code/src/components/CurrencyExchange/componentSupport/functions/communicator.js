/* ******************************
 * [communicator.js]
 * This file holds the communication calls for the component. Communication to outside
 *
 * Notes:
 *
 ******************************/

/**
* Dependencies
*/

import helpers from './../../../../helpers/index';

/**
 * Object
 */



let exposed = new class {

	getCurrenciesAndRates(callback){
		helpers.communicate.ajax.get('http://localhost:8001/getCurrenciesAndRates', result => {
			callback(helpers.convert.xml.toJSON(result));
		});
	}

	exchange(input, callback) {
		console.log('communicator_postLog: Fire');

		helpers.exchange(input, result => {
			callback(result);
		});
	}

	drawGraphAndAddListeners(self, graph, originalGraph) {

		// Save the original graph so we can add back currencies later
			let graphAllCurrencies;

			if (originalGraph == undefined){
				graphAllCurrencies = helpers.generate.copyOfArray(graph);
			} else {
				graphAllCurrencies = helpers.generate.copyOfArray(originalGraph);
			}

		// See if we already had some colours
			const lineColourLocation = graph.lineColours.stateKey;

			graphAllCurrencies.lineColours.state = self.state[lineColourLocation];
			graph.lineColours.state = self.state[lineColourLocation];

		// Set up handlers to redraw the graph on click of legendItem
			const redrawOnClickLegendItem = (legendElement) => {
				let legendItems = document.getElementById(legendElement).getElementsByTagName('ul')[0];

				legendItems = legendItems.getElementsByTagName('li');

				const totalCurrencies = graph.lineArray[1].currencies.length;

				for (let i = 0; i < legendItems.length; i++) {
					let element = legendItems[i];

					element.onclick = function () {
						const currencyName = element.getElementsByTagName('span')[0].innerHTML;

						// Should we filter this item or should we pop it back in?
						const FilteredCurrenciesCurrentGraph = self.state[graph.currencyFilterLocation].slice();

						let isLastItem = false;

						if (FilteredCurrenciesCurrentGraph.length == totalCurrencies - 1 || legendItems == 1){
							isLastItem = true;
						};

						if (FilteredCurrenciesCurrentGraph.indexOf(currencyName) == -1 && !isLastItem){
							// Set the currency to be removed
							FilteredCurrenciesCurrentGraph.push(currencyName);
							self.setState({ [graph.currencyFilterLocation] : FilteredCurrenciesCurrentGraph });

						} else if (FilteredCurrenciesCurrentGraph.indexOf(currencyName) == -1 && isLastItem){
							// If it's the last item, stop
							return;
						} else {
							// Set the currency to be added back

							const FilteredCurrencyIndex = FilteredCurrenciesCurrentGraph.indexOf(currencyName);

							FilteredCurrenciesCurrentGraph.splice(FilteredCurrencyIndex, 1);
							self.setState({ [graph.currencyFilterLocation] : FilteredCurrenciesCurrentGraph });
							graph = helpers.generate.copyOfArray(graphAllCurrencies);

						}

						// Take out what we need to take out
						FilteredCurrenciesCurrentGraph.forEach((item, index) => {
							// Take out the currency we clicked on before we render
							graph.lineArray.forEach((item, index) => {
								item.currencies.forEach((item, index) => {
									const currencyDataName = item.currency;

									if (FilteredCurrenciesCurrentGraph.indexOf(currencyDataName) !== -1){
										item.rate = '0';
									};
								});
							});
						});

						// Trigger to call another render
						exposed.drawGraphAndAddListeners(self, graph, graphAllCurrencies);
					};
				};
			};

		// Draw the graph
			const drawChain = new Promise(function (resolve, reject) {
				helpers.render.graph(graph, (output) => {
					const legendElement = output.legendElement,
						lineColours = output.lineColours;

					if (legendElement != 'undefined' || legendElement != '') {
							self.setState({[graph.lineColours.stateKey] : lineColours});
							resolve(legendElement);
					} else {
						throw Error('No legendElement ID returned, did something go wrong?');
					}
				});
			});

			drawChain.then((legendElement) => redrawOnClickLegendItem(legendElement));

			drawChain.then((legendElement) => {

				// Change the CSS to show status of item in chart
				let legendItems = document.getElementById(legendElement).getElementsByTagName('ul')[0];

				if (graph.currencyFilterLocation == undefined){
					return;
				}

				const FilteredCurrenciesCurrentGraph = self.state[graph.currencyFilterLocation].slice();

				legendItems = legendItems.getElementsByTagName('li');

				for (let i = 0; i < legendItems.length; i++) {
					let element = legendItems[i];
					const currencyName = element.getElementsByTagName('span')[0].innerHTML;

					if (element.style.opacity != 0.4 && FilteredCurrenciesCurrentGraph.indexOf(currencyName) != -1){
						// Fade it a bit
						element.style.opacity = 0.4;
					} else {
						// Bring it back
						element.style.opacity = 1;
					}

				}

			});
		}
};

/**
 * Export
 */
module.exports = exposed;

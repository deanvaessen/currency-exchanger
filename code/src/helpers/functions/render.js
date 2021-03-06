/*******************************
 * [_render.js]
 * Define helper function for rendering here
 *
 * Notes:
 * This function could possibly be cleaner by moving more of the attributes for rendering to input object instead of hardcoding it here.
 * Would make it more modular. Right now it really works for 2 scenario's, a single scale (dynamic) and a set scenario of 5 axes.
 ******************************/

/**
 * { Dependencies }
 */
//import helpers from './../index.js';
import generate from './generator';
import Rickshaw from 'Rickshaw';
import * as d3 from 'd3';
import $ from 'jquery';


 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { Graph }
	 * A function for graph rendering
	*/
	const graph = (input, callback) => {

		/**
		 * { Pre-flight check }
		 * Set up some things to enable the rendering
		*/

		// Define variables
			// Page Elements
			let chartElement = input.elements.chart,
					legendElement = input.elements.legend.legend,
					smoothingElement = input.elements.smoothing,
					sliderElement = input.elements.slider,
					chartHeight = input.attributes.height;

			// Variables for Rickshaw functions
			let parentWidth,
				clearingArray = [],
				hasSingleScale,
				singleScaleParameters,
				parentElement = document.getElementById(legendElement).parentElement.parentElement.id,
				currencies = [],
				yAxes = {},
				series = [],
				lineColours = {},
				shouldClearPrevious;

		// Do a check to see if we should clear the previous graph (does it still exist and need to be rerendered?)
			let legendItems = document.getElementById(legendElement).innerHTML;

			legendItems = (legendItems.trim) ? legendItems.trim() : legendItems.replace(/^\s+/, '');

			if (legendItems != '' || !legendItems) {
				shouldClearPrevious = true;
			}

		// More Variables
			// yAxes
				input.elements.axes.y.forEach((item, index) => {
					const axisID = item,
							axisName = 'yAxis' + index;

					yAxes[axisName] = axisID;

					if (shouldClearPrevious) {
						clearingArray.push(item);
					}

				});

		// See if we need only one scale
			if (Object.keys(yAxes).length == 1) {
				hasSingleScale = true;
			}

		/**
		 * { Clear previous }
		 * Ability to clear the previous graph
		*/

		const clearPrevious = function () {
			clearingArray.push(chartElement, legendElement, sliderElement, smoothingElement);

			if (shouldClearPrevious) {

			// Clear all
				clearingArray.forEach((item, index) => {
					if (item.substring(0, 1) !== '#'){
						item = '#' + item;
					}

					// Below has to be done to fix an issue with Rickshaw event listeners (bug in Rickshaw itself)
					$(item).empty();
					let newGraph = $(item).clone();

					$(item).replaceWith(newGraph);
				});
			}
		};

		if (shouldClearPrevious){
			clearPrevious();
		}

		/**
		 * { Currency array population }
		 * Populate the currencies array with all the relevant data (rate per date)
		*/

		// Get all the currencies
			input.lineArray[0].currencies.forEach((item, index) => {
				const currency = {
					currency : item.currency,
					rates : []
				};

				currencies.push(currency);
			});

		// For each currency
			currencies.forEach((item, index) => {
				const currencyIndex = index,
					currency = item.currency;

				// Get all the rates for a date and push them into the currency array
				input.lineArray.forEach((item, index) => {
					const dateStamp = item.date;

					item.currencies.forEach((item, index) => {

						if (currency === item.currency) {

							const rateAndDate = {
								date : dateStamp, // date
								rate : item.rate // rate
							};

							currencies[currencyIndex].rates.push(rateAndDate);
						}

					});
				});
			});

		/**
		 * { Rickshaw data array }
		 * Create an array that Rickshaw understands
		*/

		// Define some scales

			// For the 'all currencies' graph
				const largestScaleAll = d3.scaleLinear().domain([14000, 15500]).range([1050, 1100]);
				const largeScaleAll = d3.scaleLinear().domain([400, 1400]).range([800, 1050]); //940
				const mediumScaleAll = d3.scaleLinear().domain([129.01, 400]).range([800, 970]); //890
				const smallScaleAll = d3.scaleLinear().domain([15.901, 129.9]).range([670, 890]);
				const verySmallScaleAll = d3.scaleLinear().domain([2.901, 15.9]).range([300, 900]);
				const smallestScaleAll = d3.scaleLinear().domain([0, 2.9]).range([-100, 450]);

		// Then see how to treat each currency
			currencies.forEach((item, index) => {
				const currency = item.currency;
				let data = [];
				let yArray = [];

			// Get all the X and Y values for a certain currency
				item.rates.forEach((item, index) => {

					const rate = parseFloat(item.rate);

					if (isNaN(rate)){
						return;
					}

					let dateObject = item.date.split('-');

					dateObject = {
						day : dateObject[2],
						month : dateObject[1],
						year : dateObject[0]
					};

					const date = generate.secondsSinceEpochFromDate(dateObject);

					const xAndY = {
						x : date,
						y : rate
					};

					data.push(xAndY);
					yArray.push(rate);
				});

			// Decide the colour for the currency
				const decideColour = () => {

					if (input.lineColours) {
						if (input.lineColours.state[currency]){

							// Save it
							const colour = input.lineColours.state[currency];

							lineColours[currency] = colour;
							return colour;
						}
					}

					const colour = generate.colour();

					// Save it
					lineColours[currency] = colour;
					return colour;
				};

			// Push all the values into the main series Array)
				let plottedCurrency = {
					data : data.reverse(),
					color : decideColour(),
					name : currency
				};

			// Find the largest and smallest items
				//const smallestRate = Math.min.apply(0, yArray);
				const largestRate = Math.max.apply(0, yArray);

			// Take a scale to match it
				if (hasSingleScale) {
					singleScaleParameters = d3.scaleLinear().domain([0, 1]).range([50, chartHeight - 100 ]);
				} else {
					if (largestRate >= 1400) {
						plottedCurrency.scale = largestScaleAll;
					} else if (largestRate >= 400 && largestRate < 1400) {
						plottedCurrency.scale = largeScaleAll;
					} else if (largestRate >= 130 && largestRate < 400) {
						plottedCurrency.scale = mediumScaleAll;
					} else if (largestRate >= 16 && largestRate < 130) {
						plottedCurrency.scale = smallScaleAll;
					} else if (largestRate >= 3 && largestRate < 16) {
						plottedCurrency.scale = verySmallScaleAll;
					} else if (largestRate < 3) {
						plottedCurrency.scale = smallestScaleAll;
					}
				}

				series.push(plottedCurrency);

			});


		/**
		 * { Rickshaw rendering }
		 * Now go on and render the thing
		*/
		const renderTheGraph = function () {
			/*eslint-disable */
			// Read the width of the container
			parentWidth = document.getElementById(parentElement).offsetWidth;

			// Define the graph
			const graph = new Rickshaw.Graph({
				element : document.querySelector(chartElement),
				//width : parentWidth == 0 ? customGraphWidth : '',
				height : chartHeight,
				renderer : 'line',
				series : series,
				padding : hasSingleScale ? {top : 1} : ''
			});



			if (parentWidth !== 0) {
				new Rickshaw.Graph.Legend({
					graph : graph,
					element : document.getElementById(legendElement)
				});
			}

			new Rickshaw.Graph.Axis.Time({
				graph : graph
			});

			new Rickshaw.Graph.HoverDetail( {
				graph: graph,
				formatter : function(series, x, y) {
					const swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
					const content = swatch + series.name + ": " + y.toFixed(4);
					return content;
				}
			} );

			if (yAxes.yAxis5) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis5),
						graph : graph,
						scale : largestScaleAll
				});
			}

			if (yAxes.yAxis4) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis4),
						graph : graph,
						scale : largeScaleAll
				});
			}

			if (yAxes.yAxis3) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis3),
						graph : graph,
						scale : mediumScaleAll
				});
			}

			if (yAxes.yAxis2) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis2),
						graph : graph,
						scale : smallScaleAll
				});
			}

			if (yAxes.yAxis1) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis1),
						graph : graph,
						scale : verySmallScaleAll,
				});
			}

			if (yAxes.yAxis0) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis0),
						graph : graph,
						scale : hasSingleScale ? singleScaleParameters : smallestScaleAll,
						ticks : hasSingleScale? 5 : 30,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							if (hasSingleScale) {
								return y.toFixed(2);
							}

							let yTickValue = Math.abs(y);

							yTickValue = ((yTickValue/ 1000)).toFixed(1);


							if (yTickValue == 3.1)   { return '14.5K' }
							else if (yTickValue == 2.9)   { return '1200' }
							else if (yTickValue == 2.6)   { return '225' }
							else if (yTickValue == 2.4)   { return '95' }
							else if (yTickValue == 2.2)   { return '60' }
							else if (yTickValue == 2.0)   { return '27' }
							else if (yTickValue == 1.8)   { return '9.8' }
							else if (yTickValue == 1.6)   { return '8.3' }
							else if (yTickValue == 1.4)   { return '6.2' }
							else if (yTickValue == 1.0)   { return '3.8' }
							else if (yTickValue == 0.8)   { return '1.97' }
							else if (yTickValue == 0.6)   { return '1.65' }
							else if (yTickValue == 0.2)   { return '0.9' }
							else if (yTickValue == 0)   { return '0' }
						},
						orientation : 'left'
				});
			}

			graph.render();

		};

		renderTheGraph();

		/**
		 * { Post-render }
		 *
		*/
		// Return values
			const output = {
				legendElement : legendElement,
				lineColours : lineColours
			};

		// This is to catch an issue where the parentWidth cannot be read
			if (parentWidth === 0) {
				clearPrevious();
				setTimeout(function (){ renderTheGraph(); }, 0.001);
				setTimeout(function (){ callback(output); }, 10);
			} else{
				callback(output);
			}
	};

	return {
		graph : graph
	};
 })();


/**
* Export
*/
 module.exports = index;

/*******************************
 * [_render.js]
 * Define helper function for rendering here
 *
 * Notes:
 * This function could be cleaner by moving more of the attributes for rendering to input object instead of hardcoding it here.
 * Would make it more modular.
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
	const graph = input => {

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
				parentElement = document.getElementById(input.elements.legend.legend).parentElement.parentElement.id,
				currencies = [],
				yAxes = {},
				series = [];

			// yAxes
			input.elements.axes.y.forEach((item, index) => {
				const axisID = item,
						axisName = 'yAxis' + index;

				yAxes[axisName] = axisID;

				if (input.attributes.clearPrevious) {
					clearingArray.push(item);
				}

			});

			// See if we need only one scale
			if (Object.keys(yAxes).length == 1) {
				hasSingleScale = true;
			}

		/**
		 * { Clear previous }
		 * Should we clear the previous graph?
		*/

		const clearPrevious = function () {
			clearingArray.push(chartElement, legendElement, sliderElement, smoothingElement);

			if (input.attributes.clearPrevious) {

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

		if (input.attributes.clearPrevious){
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
			const verySmallScaleAll = d3.scaleLinear().domain([2.901, 15.9]).range([400, 670]);
			const smallestScaleAll = d3.scaleLinear().domain([0, 2.9]).range([0, 400]);

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

			// Push all the values into the main series Array)
			let plottedCurrency = {
				data : data.reverse(),
				color : generate.colour(),
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

		//console.log(series);

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
					console.log(x, y)
					var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
					var content = swatch + series.name + ": " + y.toFixed(4);
					return content;
				}
			} );

			if (yAxes.yAxis5) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis5),
						graph : graph,
						scale : largestScaleAll,
						orientation : 'left',
						ticks: 20,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							return '14.1K €';
							//return ((y / 100) * 2) / 1000 + 'K ' + '€';
						},
						//height : 80
				});
			}

			if (yAxes.yAxis4) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis4),
						graph : graph,
						scale : largeScaleAll,
						orientation : 'right',
						ticks: 20,
						//pixelsPerTick: something
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							//return parseInt((y / 1000) / 1.995) + '€';
							let yTickValue = Math.abs(y);

							yTickValue = parseInt((yTickValue / 1000));

							if (yTickValue == 1000)   { return '1220€' }
						},
						//height : 80
				});
			}

			if (yAxes.yAxis3) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis3),
						graph : graph,
						scale : mediumScaleAll,
						orientation : 'left',
						ticks: 40,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							//return ((y / 1000));
							let yTickValue = Math.abs(y);

							yTickValue = parseInt((yTickValue / 1000))

							if (yTickValue == 290)   { return '300€' }
						},
						//height : 210
				});
			}

			if (yAxes.yAxis2) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis2),
						graph : graph,
						scale : smallScaleAll,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							//return (y / 1000) + '€';

							let yTickValue = Math.abs(y);

							yTickValue = ((yTickValue / 1000)).toFixed(1);

							if (yTickValue == 100)   { return '15€' }
							else if (yTickValue == 110)   { return '60€' }
							else if (yTickValue == 120)   { return '105€' }
						},
						orientation : 'left',
						//height : 220
				});
			}

			if (yAxes.yAxis1) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis1),
						graph : graph,
						scale : verySmallScaleAll,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							//return (y / 1000) + '€';

							let yTickValue = Math.abs(y);

							yTickValue = ((yTickValue / 1000)).toFixed(1);

							if (yTickValue == 13)   { return '8.7€' }
							else if (yTickValue == 12)   { return '5.1€' }
						},
						orientation : 'right',
						//height : 270
				});
			}

			if (yAxes.yAxis0) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis0),
						graph : graph,
						scale : hasSingleScale ? singleScaleParameters : smallestScaleAll,
						ticks : 5,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							if (hasSingleScale) {
								return y.toFixed(2) + '€';
							}

							let yTickValue = Math.abs(y);

							yTickValue = ((yTickValue/ 1000)).toFixed(1);

							if (yTickValue == 3)   { return '2.45€' }
							else if (yTickValue == 2.5)   { return '1€' }
						},
						orientation : 'left',
						//height : hasSingleScale ? chartHeight : 400
				});
			}

			graph.render();

		};

		renderTheGraph();

		/**
		 * { Post-render }
		 *
		*/
			// This is to catch an issue where the parentWidth cannot be read
			if (parentWidth === 0) {
				clearPrevious();
				setTimeout(function (){ renderTheGraph(); }, 0.001);
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

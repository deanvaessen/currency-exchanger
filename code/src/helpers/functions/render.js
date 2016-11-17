/*******************************
 * [_render.js]
 * Define helper function for rendering here
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
	 * { graph }
	 * A functionfor graph rendering
	*/
	const graph = input => {

		// Define variables
		let currencies = [],
			yAxes = {

		};

		let chartElement = input.elements.chart,
				legendElement = input.elements.legend.legend,
				smoothingElement = input.elements.smoothing,
				sliderElement = input.elements.slider,
				chartHeight = input.attributes.height,
				singleScale,
				singleScaleParameters,
				parentElement = document.getElementById(input.elements.legend.legend).parentElement.parentElement.id;

		let parentWidth = document.getElementById(parentElement).offsetWidth;



		let clearingArray = [];

		// yAxes
		input.elements.axes.y.forEach((item, index) => {
			const axisID = item,
					axisName = 'yAxis' + index;

			yAxes[axisName] = axisID;

			if (input.attributes.clearPrevious) {
				clearingArray.push(item);
			}

			if (input.elements.axes.scales.y.singleScale) {
				singleScale = true;
			}
		});

		clearingArray.push(chartElement, legendElement, sliderElement, smoothingElement);

		// Clear previous Graph
		const clearPrevious = function () {
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

			// Get all the currencies
			input.lineArray[0].currencies.forEach((item, index) => {
				const currency = {
					currency : item.currency,
					rates : []
				};

				currencies.push(currency);
			});
		};

		clearPrevious();

		/**
		 * { Currency array population }
		 * Populate the currencies array with all the relevant data (rate per date)
		*/
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
		// First define some scales
			// For the 'all currencies' graph
			const largeScaleAll = d3.scaleLinear().domain([14000, 15500]).range([420, 500]).nice();
			const mediumScaleAll = d3.scaleLinear().domain([130, 1400]).range([290, 400]).nice();
			const smallScaleAll = d3.scaleLinear().domain([16, 129.9]).range([170, 290]).nice();
			const verySmallScaleAll = d3.scaleLinear().domain([3, 15.9]).range([100, 170]).nice();
			const smallestScaleAll = d3.scaleLinear().domain([0, 2.9]).range([0, 100]).nice();

		let series = [];

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

			// Different scales for different items
			// Find the largest item
			const smallestRate = Math.min.apply(0, yArray);
			const largestRate = Math.max.apply(0, yArray);

			// Take a scale to match it
			if (singleScale) {
				singleScaleParameters = d3.scaleLinear().domain([smallestRate, largestRate]).range([50, chartHeight - 100 ]).nice();
			} else {
				if (largestRate >= 1400) {
					plottedCurrency.scale = largeScaleAll;
				} else if (largestRate >= 130 && largestRate < 1400) {
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
			const graph = new Rickshaw.Graph({
				element : document.querySelector(chartElement),
				//width : parentWidth == 0 ? customGraphWidth : '',
				height : chartHeight,
				renderer : 'line',
				series : series,
				padding : singleScale ? {top : 1} : ''
			});


			new Rickshaw.Graph.HoverDetail({
				graph : graph
			});

			new Rickshaw.Graph.Legend({
				graph : graph,
				element : document.getElementById(legendElement)
			});

			new Rickshaw.Graph.Axis.Time({
				graph : graph
			});

			if (yAxes.yAxis4) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis4),
						graph : graph,
						scale : largeScaleAll,
						orientation : 'left',
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							return ((y / 100) * 2) / 1000 + 'K ' + '€';
						},
						height : 80
				});
			}

			if (yAxes.yAxis3) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis3),
						graph : graph,
						scale : mediumScaleAll,
						orientation : 'right',
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							return parseInt((y / 1000) / 1.995) + '€';
						},
						height : 110
				});
			}

			if (yAxes.yAxis2) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis2),
						graph : graph,
						scale : smallScaleAll,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							return (y / 1000) + '€';
						},
						orientation : 'left',
						height : 120
				});
			}

			if (yAxes.yAxis1) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis1),
						graph : graph,
						scale : verySmallScaleAll,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							return (y / 1000) + '€';
						},
						orientation : 'right',
						height : 70
				});
			}

			if (yAxes.yAxis0) {
				new Rickshaw.Graph.Axis.Y.Scaled({
						element : document.getElementById(yAxes.yAxis0),
						graph : graph,
						scale : singleScale ? singleScaleParameters : smallestScaleAll,
						tickFormat : Rickshaw.Fixtures.Number.formatKMBT = function (y) {
							if (singleScale) {
								return y.toPrecision(3) + '€';
							}
							return ((y / 1000) * 1.2).toPrecision(2) + '€';
						},
						orientation : 'left',
						height : singleScale ? chartHeight : 100
				});
			}

			graph.render();
		};

		renderTheGraph();

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

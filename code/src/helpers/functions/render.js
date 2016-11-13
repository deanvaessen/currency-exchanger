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

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { graph }
	 * Support helpers for graph rendering
	*/
	const graph = input => {

		// Input looks like this:
			/*const input = {
				element : '#CurrencyExchange__historyChart',
				lineArray : historicCurrencyList
			};*/

		console.log(input);

		let currencies = [];

		// Get all the currencies
		input.lineArray[0].currencies.forEach((item, index) => {
			const currency = {
				currency : item.currency,
				rates : []
			};

			currencies.push(currency);
		});

		console.log(currencies);

		// Populate the currencies array with all the relevant data (rate per date)
			// For each currency
			currencies.forEach((item, index) => {
				const currencyIndex = index,
					currency = item.currency;

					console.log(item);
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

		console.log(currencies);

		// Create an array that Rickshaw understands
		let series = [];

		currencies.forEach((item, index) => {
			const currency = item.currency;
			let data = [];

			// Get all the X and Y values for a certain currency
			item.rates.forEach((item, index) => {
				const rate = parseFloat(item.rate);

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
			});

			// Push all the values into the main series Array)
			const plottedCurrency = {
				data : data.reverse(),
				color : generate.colour(),
				name : currency
			};

			series.push(plottedCurrency);
		});

		console.log(series);

		// Now go on and render the thing
		const graph = new Rickshaw.Graph({
			element : document.querySelector(input.element),
			width : 1000 - 130,
			height : 400,
			renderer : 'line',
			series : series
		});

		graph.render();

		/*eslint-disable */

		const hoverDetail = new Rickshaw.Graph.HoverDetail({
			graph : graph
		});

		const legend = new Rickshaw.Graph.Legend({
			graph : graph,
			element : document.getElementById('legend')
		});

		const shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
			graph : graph,
			legend : legend
		});

		const axes = new Rickshaw.Graph.Axis.Time({
				graph : graph
		});

		axes.render();
		/*eslint-enable */

		/*let graphObject = {
			element : document.querySelector(input.element),
			renderer : 'line',
			series : series,
			onComplete: function(transport) {

				const x_axis = new Rickshaw.Graph.Axis.Time({
					graph : transport.graph
				});
				x_axis.graph.update();
			}
		};*/



/*		const graph = new Rickshaw.Graph.Axis.X({
			graph : graphObject,
			tickFormat : function (x) {
				return new Date(x * 1000).toLocaleTimeString();
			}
		});*/


		//graph.render();
	};

	return {
		graph : graph
	};
 })();


 /**
	* Export
	*/
 module.exports = index;

// This is what the series array looks like
/* {
	data : [
			{ x : 0, y : somerate },
			{ x : 1, y : somerate }
		],
		color : 'somecolor',
		name: 'somecurrency'
 },
 {
	data : [
			{ x : 0, y : somerate },
			{ x : 1, y : somerate }
		],
		color : 'somecolor',
		name: 'somecurrency'
 }*/






 /*			{
				data : [
						{ x : somedate, y : somerate },
						{ x : nextdate, y : nextrate }
					],
					color : 'somecolor',
					name: 'somecurrency'
			},
			{
				data : [
						{ x : somedate, y : somerate },
						{ x : nextdate, y : nextrate }
					],
					color : 'somecolor',
					name: 'somecurrency'
			}



			const data = [
						{ x : somedate, y : somerate },
						{ x : nextdate, y : nextrate }
					],









			const graph = new Rickshaw.Graph.Axis.X({
				graph: graphObject,
				tickFormat: function(x){
							return  x
						}
				})


 */





 /*		const graph = new Rickshaw.Graph.Axis.X({
			graph : graphObject,
			tickFormat : function(x){
						return function () {

							datesarray.forEach(function(item, index){
								const date = datesarray.shift();
								return date;
							});
						}
			}
		});*/

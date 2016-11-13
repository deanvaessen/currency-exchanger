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
		const largeScale = d3.scaleLinear().domain([13000, 14000]).nice();
		const mediumScale = d3.scaleLinear().domain([130, 400]).nice();
		const smallScale = d3.scaleLinear().domain([16, 129.9]).nice();
		const verySmallScale = d3.scaleLinear().domain([3, 15.9]).nice();
		const smallestScale = d3.scaleLinear().domain([0, 2.9]).nice();

		let series = [];

		currencies.forEach((item, index) => {
			const currency = item.currency;
			let data = [];
			let yArray = [];

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
/*			let largest;

			plottedCurrency.data.forEach((item, index) => {
				for (i = 0; i<= largest; i++){
						if (item[i]  >largest) {
								largest = item[i];
						}
				}
			})*/

			const largestRate = Math.max.apply(0, yArray);



			if (largestRate >= 400) {
				console.log(largestRate);
				plottedCurrency.scale = largeScale;
			} else if (largestRate >= 130 && largestRate < 400) {
				plottedCurrency.scale = mediumScale;
			} else if (largestRate >= 16 && largestRate < 130) {
				plottedCurrency.scale = smallScale;
			} else if (largestRate >= 3 && largestRate < 16) {
				plottedCurrency.scale = verySmallScale;
			} else if (largestRate < 3) {
				plottedCurrency.scale = smallestScale;
			}

/*			switch (currency) {
					case 'IDR' :
					case 'KRW' :
						plottedCurrency.scale = largeScale;
						break;
					case 'HUF' :
						plottedCurrency.scale = mediumScale;
						break;
					case 'ZAR' :
					case 'MXN' :
					case 'CZK' :
					case 'THB' :
					case 'PHP':
					case 'RUB':
					case 'INR':
					case 'JPY':
						plottedCurrency.scale = smallScale;
						console.log(currency);
						break;
					default:
						plottedCurrency.scale = verySmallScale;
			}*/

			series.push(plottedCurrency);

			/*
			   Smallest
			   0.87785 = GBP
			   1.0762 = CHF
			   1.0895 = USD
			   1.4336 = AUD
			   1.4689 = CAD
			   1.5132 = NZD
			   1.5348 = SGD
			   1.9558 = BGN

			  verySmall
			   3.528 = TRY
			   3.5815 = BRL
			   4.1841 = ILS
			   4.3588 = PLN
			   4.6883 = MYR
			   4.5023 = RON
			   7.4065 = CNY
			   7.4414 = DKK
			   7.5045 = HRK
			   8.4495 = HKD
			   9.0733 = NOK
			   9.909 = SEK
			   15.1054 = ZAR

			  Small
			   22.0369 = MXN
			   27.022 = CZK
			   38.307 = THB
			   53.358 = PHP
			   69.6283 = RUB
			   72.7085 = INR
			   116.4 = JPY

			  Medium
			   307.3 = HUF

			  Large
			   14473.88 = IDR
			   1264.88 = KRW
			*/
		});

		console.log(series);

		// Now go on and render the thing
			const graph = new Rickshaw.Graph({
				element : document.querySelector(input.element),
				//width : 1000 - 130,
				height : 1200,
				renderer : 'line',
				series : series
			});


			/*eslint-disable */ // KAN WEER WEG DEZE REGEL

			const hoverDetail = new Rickshaw.Graph.HoverDetail({
				graph : graph
			});

			const legend = new Rickshaw.Graph.Legend({
				graph : graph,
				element : document.getElementById('legend')
			});

			new Rickshaw.Graph.Axis.Time({
				graph : graph
			});

			new Rickshaw.Graph.Axis.Y.Scaled({
					element: document.getElementById('axis0'),
									graph : graph,
									scale : smallestScale,
									tickFormat : Rickshaw.Fixtures.Number.formatKMBT,
									orientation : 'left'
			 });

			new Rickshaw.Graph.Axis.Y.Scaled({
					element: document.getElementById('axis1'),
									graph : graph,
									scale : verySmallScale,
									tickFormat : Rickshaw.Fixtures.Number.formatKMBT,
									orientation : 'right'
			 });

			new Rickshaw.Graph.Axis.Y.Scaled({
					element: document.getElementById('axis2'),
									graph : graph,
									scale : smallScale,
									orientation : 'left',
									tickFormat : Rickshaw.Fixtures.Number.formatKMBT
			 });

			new Rickshaw.Graph.Axis.Y.Scaled({
					element: document.getElementById('axis3'),
									graph : graph,
									scale : mediumScale,
									orientation : 'right',
									tickFormat : Rickshaw.Fixtures.Number.formatKMBT
			 });

			new Rickshaw.Graph.Axis.Y.Scaled({
					element: document.getElementById('axis4'),
									graph : graph,
									scale : largeScale,
									orientation : 'left',
									tickFormat : Rickshaw.Fixtures.Number.formatKMBT
			 });

/*			const yAxis = new Rickshaw.Graph.Axis.Y.Scaled({
				graph : graph,
				scale : 500
			 });*/

			graph.render();
			// needs jquery
/*			const shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
				graph : graph,
				legend : legend
			});*/

/*			const timeAxis = new Rickshaw.Graph.Axis.Time({
					graph : graph
			});


			const yAxis = new Rickshaw.Graph.Axis.Y({
									graph : graph,
									tickFormat : function(y){return 9000}
			 });*/

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

/*******************************
 * [_interaction.js]
 * Define the helper functions for interacting with the page
 ******************************/

/**
 * { Dependencies }
 */
import generate from './generator';

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { Interactors }
	 *
	*/

	const disableScrollingTimer = (input, callback) => {

		const instantiationTime = generate.secondsSinceEpoch();


			const x = input.x;
			const y = input.y;

		(function scrollBackToPosition() {
			let currentTime = generate.secondsSinceEpoch();

			console.log('called!');

			if (currentTime >= (instantiationTime + input.timeout)) {
				return;
			}
			window.scrollTo(x, y);

			setTimeout(scrollBackToPosition, 0.00000000000000001);
		}());
	};

	return {
		disableScrollingTimer : disableScrollingTimer
	};
 })();


 /**
	* Export
	*/
 module.exports = index;


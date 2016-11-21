/*******************************
 * [_polyfill.js]
 * Define the helper functions for polyfills
 ******************************/
 /*eslint-disable */ // Yeah, not going to bother too  much linting other people's polyfills

/**
 * { Dependencies }
 */

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { Polyfills }
	 *
	*/

	const customEvents = () => {
		// IE polyfill for custom events
		(function () {

			if ( typeof window.CustomEvent === "function" ) return false;

			function CustomEvent ( event, params ) {
				params = params || { bubbles: false, cancelable: false, detail: undefined };
				var evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
				return evt;
			 }

			CustomEvent.prototype = window.Event.prototype;

			window.CustomEvent = CustomEvent;
		})();

	};

	return {
		customEvents : customEvents
	};
 })();


/**
* Export
*/
 module.exports = index;

/* ******************************
 * [communication.js]
 * Set up support functions for communication
 *
 * Notes:
 *
 ******************************/

/**
* Dependencies
*/


/**
* Object
*/


/*eslint-disable */

const commUtils = (function() {

	const ajax = {

		get : function (url, callback) {
			const request = new XMLHttpRequest();

			request.open("GET", url, true);
			request.onreadystatechange = function(){
			    if (request.readyState == 4) {
			        if (request.status == 200 || request.status == 0) {
			            callback(request.responseXML);
			        }
			    }
			}
			request.send();
		}
	}

	return {
		ajax : ajax,
	}
})();

/**
 * Export
 */
module.exports = commUtils;

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
		// ajax.get('/test.php', {foo: 'bar'}, function() {});

		x : function () {
				if (typeof XMLHttpRequest !== 'undefined') {
						return new XMLHttpRequest();
				}
				var versions = [
						"MSXML2.XmlHttp.6.0",
						"MSXML2.XmlHttp.5.0",
						"MSXML2.XmlHttp.4.0",
						"MSXML2.XmlHttp.3.0",
						"MSXML2.XmlHttp.2.0",
						"Microsoft.XmlHttp"
				];

				var xhr;
				for (var i = 0; i < versions.length; i++) {
						try {
							xhr = new ActiveXObject(versions[i]);
							break;
						} catch (e) {
						}
				}
				return xhr;
		},

		send : function (url, callback, method, data, async, type) {
				if (async === undefined) {
					async = true;
				}


				var x = ajax.x();
				x.open(method, url, async);
				x.onreadystatechange = function () {
						if (x.readyState == 4) {
							callback(x.responseText)
						}
				};
				if (method == 'POST') {
					if  (type == 'JSON') {
						x.setRequestHeader('Content-type', 'application/json');

						// Has to be stringified
						data = JSON.stringify(data)
					} else{
						x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					}
				}

				x.send(data)
		},

		get : function (url, data, callback, async) {

				var query = [];
				for (var key in data) {
				const payload = JSON.stringify(data[key])
				//console.log('payload: ',  payload)
					query.push('"' + key + '"' + ':' + payload);
				}


				//wrap it in brackets
				query = query.map(function(key){
					return ('{' + key + '}')
				})

				//encode
				query = query.map(function(key){
					return encodeURIComponent(key)
				})


				console.log('Utils.js - Fire Encoded Query: ', query)
				ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
		},

		post : function (url, data, callback, async, type) {
			if (type == 'JSON'){
				ajax.send(url, callback, 'POST', data, async, type)
			}else {
				var query = [];
				for (var key in data) {
				    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
				}
				ajax.send(url, callback, 'POST', query.join('&'), async, type)
			}

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

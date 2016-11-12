/*******************************
 * [_conversion.js]
 * Define the helper function for misc. conversion here
 ******************************/

/**
 * { Dependencies }
 */

 /**
 * { Function }
 */
 const index = (function () {

	/**
	 * { xml }
	 * Support helpers for xml conversion
	*/
	const xml = {

		// Converts XML to JSON
		toJSON : function (input) {
			// Create the return object
				let obj = {};

				if (input.nodeType == 1) { // element
					// do attributes
					if (input.attributes.length > 0) {
					obj['@attributes'] = {};
						for (let j = 0; j < input.attributes.length; j++) {
							let attribute = input.attributes.item(j);

							obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
						}
					}
				} else if (input.nodeType == 3) { // text
					obj = input.nodeValue;
				}

				// do children
				if (input.hasChildNodes()) {
					for (let i = 0; i < input.childNodes.length; i++) {
						let item = input.childNodes.item(i);
						let nodeName = item.nodeName;

						if (typeof (obj[nodeName]) == 'undefined') {
							obj[nodeName] = this.toJSON(item);
						} else {
							if (typeof (obj[nodeName].push) == 'undefined') {
								let old = obj[nodeName];

								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(this.toJSON(item));
						}
					}
				}
				return obj;
		}

		// Illegal chars
			//.match(/[\<\>;:.\^\,]+/i)

	};

	return {
		xml : xml
	};
 })();


 /**
	* Export
	*/
 module.exports = index;

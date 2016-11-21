# Currency Exchange component
![Screenshot](/meta/screenshot.png?raw=true)

## Documentation
* Changelog in meta/changelog

## Getting started
* Clone, cd code, npm install, npm start


## Features
* Exchange any currency
* Calculation is automatically redone each time a currency or amount is changed
* See a chart of the history of the currency you are comparing a currency to
* See a chart of the historic value of all currencies compared to the Euro
* Chart of selected currencies is redrawn each time input changes (currency or amount)
* Chart of historical currencies is redrawn each time a legend item is clicked

## Known issues
* Form 'jumps' on submition (i.e. input a number). This seems to be default behaviour and seemingly very tricky to get around because I would need to run an event.preventDefault(), which I found out is apparently hampered by the form library I am using due to the fact that putting the formSubmit call into a function with a readable event (that I could hook into) fails the submition. Would have to talk to form library maintainer to see how to manage this.
* As a workaround for the above if you want to test the disabling/enabling of currencies on the Historical Exchange Rate, input an amount first. This stops the jumping for that part of the page.
<br />
<br />
* IE didplays a 'symbols' error on runtime. This appears to be a Babel issue. I tried adding a polyfill but it's apparently quite adamant that it doesn't want to work. I'll fix this tonight. 

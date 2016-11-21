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
* Form 'jumps' on submition (i.e. input a number). This seems to be default form submition behaviour and seemingly very tricky to get around because I would need to run an event.preventDefault(), which I found out is apparently hampered by the form library I am using due to the fact that putting the formSubmit call into a function with a readable event (that I could hook into) fails the submition. Would have to talk to form library maintainer to see how to manage this.
* As a workaround for the above if you want to test the disabling/enabling of currencies on the Historical Exchange Rate, open Chrome and input an amount first. This stops the jumping for that part of the page.
<br />
<br />
* In connection with the above, IE and Firefox do not seem to completely like how form submission is done. To counter the issue above of not being able to put the form submition into the same react event (like "onChange") I had to seperate them out into things like formSubmition() on onKeyUp, custom events on onKeyDown. This works fine in Chrome, IE and Firefox do not like this I think. Leads to the below:
* IE does not register the first input properly, meaning input '222' becomes '22'.
* Firefox does not have the above issue, but does not submit automatically properly on the selection of a new currency. Upon re-clicking the currency list, or inputting a number, all is well again.
<br />
<br />
Lesson learned: test browser compatibilty more often and earlier for each major feature.

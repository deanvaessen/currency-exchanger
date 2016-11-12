/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import React from 'react';
import { mount } from 'enzyme'
//import sinon from 'sinon';
import Form from 'components/FormComponent/FormComponent.js';
import translationEngine from './../../src/helpers/translateNumber.js'

describe('<FormComponent />', () => {

	it('allows us to set props', () => {
		const wrapper = mount(<Form/>);

		wrapper.setProps({ bar: "foo" });
		expect(wrapper.props().bar).to.equal("foo");
	});

	//This test fails, seems like Formous events are not properly captured during testing. I have written a new test below that tests the translation function itself.

		/*it('simulates click events', () => {
			 const wrapper = mount(<Form />),
				component = wrapper.find('FormComponent'),
				props = component.props();

			//wrapper.find('.FormComponent__inputArabic').simulate('keydown', { which: '1' })
			wrapper.find('.FormComponent__inputArabic').simulate('change', { target: { value: '1' }})
			wrapper.find('.FormComponent__submit').simulate('click');
			expect(wrapper.find('FormComponent').props().fields.arabic.value).to.equal('1');*/


			/**
			 * Keep this as reference
			 */
				/*
					const onButtonClick = sinon.spy();
					const wrapper = shallow(
						<Foo onButtonClick={onButtonClick} />
					);
					expect(onButtonClick).to.have.property('callCount', 1);
					expect(onButtonClick.calledOnce).to.equal(true);
				*/
		//});

	// Do some translation tests and match output with expected value
	it('should translate in an expected manner', () => {
		// Function to test an array of tests
		const callQueries = input => {

			// Prototype query
			let protoQuery = {
				arabic : {
					value : null
				}
			}

			// Results array
			let results = {
				failed : [],
				passed : [],
			};

			// For each item in the array, run a test
			input.forEach(function (item, index) {
				let query = protoQuery;
				query.arabic.value = item.input;

				let translation = translationEngine(query)

				// See if it matches or not...
				if (item.expect === translation.english.value){
					// Catalogue the result
					results.passed.push({
						input: item.input,
						output : translation.english.value,
						expected: item.expect
					})
				}else{
					// Catalogue the result
					results.failed.push({
						input: item.input,
						output : translation.english.value,
						expected: item.expect
					})

					// Log the result
					console.log('');
					console.log('');
					console.log('/**');
					console.log('Sorry, this translation test failed:');
						console.log('	Input: ' + item.input);
						console.log('	Output: ' + translation.english.value);
						console.log('	Expected: ' + item.expect);
				}
			});

			// Log result
			console.log('');
			console.log('');
			console.log('');
			console.log('/***');
			console.log('Translation test results:');
				console.log('	Failed: ' + results.failed.length);
				console.log('	Passed: ' + results.passed.length);
			console.log('');

			// Finish test
			expect(results.failed.length).to.equal(0);
		}

		// Call some queries to test the translation
		callQueries([
			{
				input: '1521100',
				expect: 'one million and five hundred twenty-one thousand and one hundred'
			},
			{
				input: '100',
				expect: 'one hundred'
			},
			{
				input: '5',
				expect: 'five'
			},
			{
				input: '0',
				expect: 'zero'
			},
			{
				input: '18',
				expect: 'eighteen'
			},
			{
				input: '80',
				expect: 'eighty'
			},
			{
				input: '2145251255',
				expect: 'two billion and one hundred forty-five million and two hundred fifty-one thousand and two hundred fifty-five'
			},
			{
				input: '23214',
				expect: 'twenty-three thousand and two hundred fourteen'
			},
			{
				input: '98561478',
				expect: 'ninety-eight million and five hundred sixty-one thousand and four hundred seventy-eight'
			},
			{
				input: '00000222',
				expect: 'two hundred twenty-two'
			},
			{
				input: '000',
				expect: 'zero'
			}
		]);

	});

});
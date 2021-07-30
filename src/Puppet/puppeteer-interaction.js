"use strict";


//=====================================================================
//=====================================================================
//
//		scraper-interaction
//
//=====================================================================
//=====================================================================


//=====================================================================
//=====================================================================
//
//		exports
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
// Interaction
exports.click_on = click_on;
exports.send_text = send_text;


//=====================================================================
//=====================================================================
//
//		Click On
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
/*
	Options:
		- expects_navigation (boolean): If TRUE, then wait for navigation after clicking.
*/
async function click_on( Puppet, Selector, Options = { click_delay: false, expects_navigation: false } )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await Puppet.find_element( Puppet, Selector );
	if ( result.error ) { return result; }
	if ( !result.element ) { throw new Error( `Selector [${Selector}] does not exist.` ); }
	let element = result.element;

	// Get the click options.
	let click_options = {};
	if ( Options.click_delay ) { click_options.delay = Options.click_delay; }

	// Perform the click.
	let page_length = ( await Puppet.PuppeteerBrowser.pages() ).length;
	await element.focus();
	if ( Options.expects_navigation )
	{
		await Promise.all( [
			element.click( click_options ),
			// App.PuppeteerPage.waitForNavigation( { waitUntil: 'networkidle0' } ),
			Puppet.PuppeteerPage.waitForNavigation( { waitUntil: 'networkidle2' } ),
		] );
	}
	else
	{
		await element.click( click_options );
	}

	// Package and return the result.
	let click_on_result = { click_on: true };
	let new_page_length = ( await Puppet.PuppeteerBrowser.pages() ).length;
	if ( new_page_length > page_length ) { click_on_result.new_tab = true; }
	return click_on_result;
}


//=====================================================================
//=====================================================================
//
//		Send Text
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function send_text( Puppet, Selector, Text )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await Puppet.find_element( Puppet, Selector );
	if ( result.error ) { return result; }
	if ( !result.element ) { throw new Error( `Selector [${Selector}] does not exist.` ); }
	let element = result.element;

	Text = '' + Text; // Force text to be text.
	await element.type( Text );

	return { send_text: true };
}


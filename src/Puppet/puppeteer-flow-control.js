"use strict";


//=====================================================================
//=====================================================================
//
//		scraper-flow-control
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
// Flow Control
exports.has_selector = has_selector;
exports.wait_for = wait_for;
exports.wait_for_navigation = wait_for_navigation;
exports.wait_for_change = wait_for_change;
exports.wait_while_exists = wait_while_exists;


//=====================================================================
//=====================================================================
//
//		Has Selector
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function has_selector( App, Selector )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await App.libPuppeteer.find_element( App, Selector );
	if ( result.error ) { return result; }
	let element = result.element;

	return { has_selector: !!element };
}


//=====================================================================
//=====================================================================
//
//		Wait For
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function wait_for( App, Selector )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	if ( Selector.startsWith( '//' ) )
	{
		await App.PuppeteerPage.waitForXPath( Selector );
	}
	else
	{
		await App.PuppeteerPage.waitForSelector( Selector );
	}

	return { wait_for: true };
}


//=====================================================================
//=====================================================================
//
//		Wait For Navigation
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function wait_for_navigation( App, Options )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	await App.PuppeteerPage.waitForNavigation( Options );

	return { wait_for_navigation: true };
}


//=====================================================================
//=====================================================================
//
//		Wait For Change
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function wait_for_change( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	// await App.PuppeteerPage.waitForNavigation( Options );

	return { wait_for_change: false };
}


//=====================================================================
//=====================================================================
//
//		Wait While Exists
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function wait_while_exists( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	// await App.PuppeteerPage.waitForNavigation( Options );

	return { wait_while_exists: false };
}



"use strict";


//=====================================================================
//=====================================================================
//
//		scraper-state-mgmt
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
// State Management
exports.navigate_to = navigate_to;
exports.get_pages = get_pages;
exports.switch_to_page = switch_to_page;
exports.get_cookies = get_cookies;
exports.set_cookies = set_cookies;


//=====================================================================
//=====================================================================
//
//		Navigate To
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function navigate_to( App, Url )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	await Promise.all( [
		App.PuppeteerPage.goto( Url ),
		App.PuppeteerPage.waitForNavigation( { waitUntil: 'networkidle0' } ),
		// App.PuppeteerPage.waitForNavigation( { waitUntil: 'networkidle2' } ),
	] );

	return { navigate_to: true };
}


//=====================================================================
//=====================================================================
//
//		Get Pages
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_pages( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let browser_pages = await App.PuppeteerBrowser.pages();
	let pages = [];
	for ( let page_index = 0; page_index < browser_pages.length; page_index++ )
	{
		let page = browser_pages[ page_index ];
		pages.push( {
			number: page_index + 1,
			url: await page.url(),
		} );
	}

	return {
		get_pages: true,
		pages: pages,
	};
}


//=====================================================================
//=====================================================================
//
//		Switch to Page
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function switch_to_page( App, PageOptions )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	// Find the page.
	let browser_pages = await App.PuppeteerBrowser.pages();
	let found_index = -1;
	for ( let page_index = 0; page_index < browser_pages.length; page_index++ )
	{
		let page = browser_pages[ page_index ];
		if ( PageOptions.page_number )
		{
			if ( PageOptions.page_number === ( page_index + 1 ) )
			{
				found_index = page_index;
				break;
			}
		}
		else if ( PageOptions.url )
		{
			let url = await page.url();
			if ( url === PageOptions.url_starts_with )
			{
				found_index = page_index;
				break;
			}
		}
		else if ( PageOptions.url_starts_with )
		{
			let url = await page.url();
			if ( url.startsWith( PageOptions.url_starts_with ) )
			{
				found_index = page_index;
				break;
			}
		}
		else if ( PageOptions.has_selector )
		{
			let element = null;
			if ( PageOptions.has_selector.startsWith( '//' ) )
			{
				element = await page.$x( PageOptions.has_selector );
			}
			else
			{
				element = await page.$( PageOptions.has_selector );
			}
			if ( element )
			{
				found_index = page_index;
				break;
			}
		}
	}

	// Return if not found.
	if ( found_index < 0 )
	{
		return { switch_to_page: false, page_number: -1, };
	}

	// Switch the page.
	App.PuppeteerPage = browser_pages[ found_index ];
	return { switch_to_page: true, page_number: found_index + 1, };
}


//=====================================================================
//=====================================================================
//
//		Get Cookies
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_cookies( App )
{
	return { get_cookies: false };
}


//=====================================================================
//=====================================================================
//
//		Set Cookies
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function set_cookies( App )
{
	return { set_cookies: false };
}



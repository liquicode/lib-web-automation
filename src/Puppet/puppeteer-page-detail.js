"use strict";


//=====================================================================
//=====================================================================
//
//		scraper-page-detail
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
// Page Detail
exports.get_page = get_page;
exports.get_page_url = get_page_url;
exports.get_page_content = get_page_content;
exports.get_page_image = get_page_image;


//=====================================================================
//=====================================================================
//
//		Get Page
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_page( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page: true,
		url: await App.PuppeteerPage.url(),
		content: await App.PuppeteerPage.content(),
		image: await App.PuppeteerPage.screenshot( { fullPage: true, encoding: 'base64' } ),
	};
}


//=====================================================================
//=====================================================================
//
//		Get Page Url
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_page_url( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_url: true,
		url: await App.PuppeteerPage.url(),
	};
}


//=====================================================================
//=====================================================================
//
//		Get Page Content
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_page_content( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_content: true,
		content: await App.PuppeteerPage.content(),
	};
}


//=====================================================================
//=====================================================================
//
//		Get Page Image
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_page_image( App )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_image: true,
		image: await App.PuppeteerPage.screenshot( { fullPage: true, encoding: 'base64' } ),
	};
}



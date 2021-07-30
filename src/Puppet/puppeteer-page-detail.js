"use strict";


//=====================================================================
//=====================================================================
//
//		puppeteer-page-detail.js
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
async function get_page( Puppet )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page: true,
		url: await Puppet.PuppeteerPage.url(),
		content: await Puppet.PuppeteerPage.content(),
		image: await Puppet.PuppeteerPage.screenshot( { fullPage: true, encoding: 'base64' } ),
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
async function get_page_url( Puppet )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_url: true,
		url: await Puppet.PuppeteerPage.url(),
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
async function get_page_content( Puppet )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_content: true,
		content: await Puppet.PuppeteerPage.content(),
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
async function get_page_image( Puppet )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	return {
		get_page_image: true,
		image: await Puppet.PuppeteerPage.screenshot( { fullPage: true, encoding: 'base64' } ),
	};
}



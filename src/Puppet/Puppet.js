

exports.Puppet =
	function Puppet( Config )
	{
		let puppet =
		{
			Config: Config,
			PuppeteerBrowser: null,
			PuppeteerPage: null,
		};

		// Session Management
		{
			let LIB = require( './puppeteer-session-mgmt.js' );
			puppet.default_session_config = function () { return LIB.default_session_config(); };
			puppet.start_session = async function ( Config ) { return LIB.start_session( puppet, Config ); };
			puppet.end_session = async function () { return LIB.end_session( puppet ); };
			puppet.get_session_status = async function () { return LIB.get_session_status( puppet ); };
		}

		// State Management
		{
			let LIB = require( './puppeteer-state-mgmt.js' );
			puppet.navigate_to = async function ( Url ) { return LIB.navigate_to( puppet, Url ); };
			puppet.get_pages = async function () { return LIB.get_pages( puppet ); };
			puppet.switch_to_page = async function ( PageOptions = { page_number: 0, url: '', url_starts_with: '', has_selector: '' } ) { return LIB.switch_to_page( puppet, PageOptions ); };
			// puppet.get_cookies = async function () { return LIB.get_cookies( puppet ); };
			// puppet.set_cookies = async function () { return LIB.set_cookies( puppet ); };
		};

		// Page Detail
		{
			let LIB = require( './puppeteer-page-detail.js' );
			puppet.get_page = async function () { return LIB.get_page( puppet ); };
			puppet.get_page_url = async function () { return LIB.get_page_url( puppet ); };
			puppet.get_page_content = async function () { return LIB.get_page_content( puppet ); };
			puppet.get_page_image = async function () { return LIB.get_page_image( puppet ); };
		}

		// Page Content
		{
			let LIB = require( './puppeteer-page-content.js' );
			puppet.find_element = async function ( Selector ) { return LIB.find_element( puppet, Selector ); };
			puppet.modelize = async function ( Selector ) { return LIB.modelize( puppet, Selector ); };
			puppet.get_text = async function ( Selector ) { return LIB.get_text( puppet, Selector ); };
			puppet.get_table = async function ( Selector ) { return LIB.get_table( puppet, Selector ); };
			// puppet.get_image = async function ( Selector, Options ) { return LIB.get_image( puppet, Selector, Options ); };
		}

		// Interaction
		{
			let LIB = require( './puppeteer-interaction.js' );
			puppet.click_on = async function ( Selector, Options = { click_delay: false, expects_navigation: false } ) { return LIB.find_element( puppet, Selector, Options ); };
			puppet.send_text = async function ( Selector, Text ) { return LIB.modelize( puppet, Selector, Text ); };
		}

		// Flow Control
		{
			let LIB = require( './puppeteer-flow-control.js' );
			puppet.has_selector = async function ( Selector ) { return LIB.has_selector( puppet, Selector ); };
			puppet.wait_for = async function ( Selector ) { return LIB.wait_for( puppet, Selector ); };
			puppet.wait_for_navigation = async function ( Options ) { return LIB.wait_for_navigation( puppet, Options ); };
			// puppet.wait_for_change = async function () { return LIB.wait_for_change( puppet ); };
			// puppet.wait_while_exists = async function () { return LIB.wait_while_exists( puppet ); };
		}

		return puppet;
	};

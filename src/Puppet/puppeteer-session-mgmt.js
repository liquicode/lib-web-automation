"use strict";


//=====================================================================
//=====================================================================
//
//		scraper-session-mgmt
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
function lib_missing_error( LibraryName )
{
	console.error( `LIB-WEB-AUTOMATION: An npm library required for this service provider [${LibraryName}] was not found.` );
	console.error( `LIB-WEB-AUTOMATION: The npm library [${LibraryName}] was not found.` );
	console.error( `LIB-WEB-AUTOMATION: To install [${LibraryName}] please use: npm install --save ${LibraryName}` );
	return;
}


//=====================================================================
//=====================================================================
//
//		exports
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
// Session Management
exports.default_session_config = default_session_config;
exports.start_session = start_session;
exports.end_session = end_session;
exports.get_session_status = get_session_status;


//=====================================================================
//=====================================================================
//
//		Start Session
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36';


//---------------------------------------------------------------------
function default_session_config()
{
	return {
		stealth: false,
		captcha: false,
		captcha_credentials:
		{
			id: '',
			token: '',
		},
		headless: false,
		slow_mo: 0,
		user_agent: DEFAULT_USER_AGENT,
	};
}


//---------------------------------------------------------------------
async function start_session( Puppet, Config )
{
	if ( Puppet.PuppeteerBrowser ) { return { error: 'Session already exists!' }; }

	if ( typeof Config === 'undefined' ) { Config = default_session_config(); }
	if ( !Config ) { Config = default_session_config(); }

	// Initialize Puppeteer.
	let LIB_PUPPETEER = null;
	let LIB_PUPPETEER_EXTRA = null;
	{
		// Load puppeteer
		try
		{
			LIB_PUPPETEER = require( 'puppeteer' );
		}
		catch ( error ) 
		{
			lib_missing_error( 'puppeteer' );
			throw error;
		}

		// Load the puppeteer extra libraries.
		try
		{
			LIB_PUPPETEER_EXTRA = require( 'puppeteer-extra' );
		}
		catch ( error ) 
		{
			lib_missing_error( 'puppeteer-extra' );
			throw error;
		}

		// Stealth Plugin
		if ( Config.stealth )
		{
			try
			{
				let LIB_PUPPETEER_EXTRA_PLUGIN_STEALTH = require( 'puppeteer-extra-plugin-stealth' );
				LIB_PUPPETEER_EXTRA.use( LIB_PUPPETEER_EXTRA_PLUGIN_STEALTH() );
			}
			catch ( error ) 
			{
				lib_missing_error( 'puppeteer-extra-plugin-stealth' );
				throw error;
			}
		}

		// Captcha Plugin
		if ( Config.captcha )
		{
			try
			{
				let LIB_PUPPETEER_EXTRA_PLUGIN_RECAPTCHA = require( 'puppeteer-extra-plugin-recaptcha' );
				LIB_PUPPETEER_EXTRA.use( LIB_PUPPETEER_EXTRA_PLUGIN_RECAPTCHA(
					{
						provider: Config.captcha_credentials,
						// visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
					}
				) );
			}
			catch ( error ) 
			{
				lib_missing_error( 'puppeteer-extra-plugin-recaptcha' );
				throw error;
			}
		}
	}

	// Start the browser
	let options =
	{
		headless: Config.headless,
		sloMo: Config.slow_mo,
		slomo: Config.slow_mo,
		defaultViewport: null,
		ignoreHTTPSErrors: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-accelerated-2d-canvas',
			'--disable-gpu',
			'--disable-infobars',
			'--window-position=0,0',
			'--ignore-certifcate-errors',
			'--ignore-certifcate-errors-spki-list',
		],
	};
	{
		// Set the user agent.
		if ( typeof Config.user_agent === 'undefined' ) { Config.user_agent = DEFAULT_USER_AGENT; }
		if ( !Config.user_agent ) { Config.user_agent = DEFAULT_USER_AGENT; }
		options.args.push( `--user-agent="${Config.user_agent}"` );
	}
	Puppet.PuppeteerBrowser = await LIB_PUPPETEER_EXTRA.launch( options );

	let pages = await Puppet.PuppeteerBrowser.pages();
	if ( pages.length === 0 )
	{
		await Puppet.PuppeteerBrowser.newPage();
	}
	pages = await Puppet.PuppeteerBrowser.pages();
	Puppet.PuppeteerPage = pages[ pages.length - 1 ];

	// Return
	return { start_session: true };
}


//=====================================================================
//=====================================================================
//
//		End Session
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function end_session( Puppet )
{
	if ( Puppet.PuppeteerBrowser ) 
	{
		await Puppet.PuppeteerBrowser.close();
	}
	Puppet.PuppeteerBrowser = null;
	Puppet.PuppeteerPage = null;

	// Return
	return { end_session: true };
}


//=====================================================================
//=====================================================================
//
//		Get Session Status
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_session_status( Puppet )
{
	if ( !Puppet.PuppeteerBrowser ) { return { get_session_status: false }; }
	if ( !Puppet.PuppeteerPage ) { return { get_session_status: false }; }
	return { get_session_status: true };
}



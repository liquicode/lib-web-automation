

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

		return puppet;
	};

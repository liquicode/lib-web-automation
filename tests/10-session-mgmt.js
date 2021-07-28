"use strict";


const LIB = require( '../src/lib-web-automation.js' );
const LIB_ASSERT = require( 'assert' );

//---------------------------------------------------------------------
describe( `10) Session Management`,
	function ()
	{


		//---------------------------------------------------------------------
		describe( `Session Tests`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `Startup and Shutdown with default config`,
					async function ()
					{
						let puppet = LIB.Puppet();
						let value = null;
						value = await puppet.start_session();
						LIB_ASSERT.ok( value.start_session );
						value = await puppet.get_session_status();
						LIB_ASSERT.ok( value.get_session_status );
						value = await puppet.end_session();
						LIB_ASSERT.ok( value.end_session );
						return;
					} );

				return;
			} );


		return;
	} );

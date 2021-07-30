"use strict";


const LIB = require( '../src/lib-web-automation.js' );
const LIB_ASSERT = require( 'assert' );

//---------------------------------------------------------------------
describe( `10) Session Management`,
	function ()
	{


		//---------------------------------------------------------------------
		let Puppet = null;


		//---------------------------------------------------------------------
		beforeEach(
			async function ()
			{
				this.Puppet = LIB.Puppet();
				return;
			} );


		//---------------------------------------------------------------------
		afterEach(
			async function ()
			{
				this.Puppet = null;
				return;
			} );


		//---------------------------------------------------------------------
		it( `Startup and Shutdown, default config`,
			async function ()
			{
				let value = null;
				value = await this.Puppet.start_session();
				LIB_ASSERT.ok( value.start_session );
				value = await this.Puppet.get_session_status();
				LIB_ASSERT.ok( value.get_session_status );
				value = await this.Puppet.end_session();
				LIB_ASSERT.ok( value.end_session );
				return;
			} );

		//---------------------------------------------------------------------
		it( `Startup and Shutdown, headless`,
			async function ()
			{
				let value = null;
				value = await this.Puppet.start_session( { headless: true } );
				LIB_ASSERT.ok( value.start_session );
				value = await this.Puppet.get_session_status();
				LIB_ASSERT.ok( value.get_session_status );
				value = await this.Puppet.end_session();
				LIB_ASSERT.ok( value.end_session );
				return;
			} );


		return;
	} );

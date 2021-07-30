"use strict";


const LIB = require( '../src/lib-web-automation.js' );
const LIB_ASSERT = require( 'assert' );

//---------------------------------------------------------------------
describe( `20) State Management`,
	function ()
	{


		//---------------------------------------------------------------------
		let Puppet = null;


		//---------------------------------------------------------------------
		beforeEach(
			async function ()
			{
				let value = null;
				this.Puppet = LIB.Puppet();
				value = await this.Puppet.start_session( { headless: true } );
				LIB_ASSERT.ok( value.start_session );
				value = await this.Puppet.get_session_status();
				LIB_ASSERT.ok( value.get_session_status );
				return;
			} );


		//---------------------------------------------------------------------
		afterEach(
			async function ()
			{
				let value = null;
				value = await this.Puppet.end_session();
				LIB_ASSERT.ok( value.end_session );
				this.Puppet = null;
				return;
			} );


		//---------------------------------------------------------------------
		describe( `Navigates to HTTP`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `Navigates to Google (HTTP)`,
					async function ()
					{
						let value = null;
						value = await this.Puppet.navigate_to( "http://google.com" );
						LIB_ASSERT.ok( value.navigate_to );
						return;
					} );

				//---------------------------------------------------------------------
				it( `Navigates to Wikipedia (HTTP)`,
					async function ()
					{
						let value = null;
						value = await this.Puppet.navigate_to( "http://en.wikipedia.org/wiki/Main_Page" );
						LIB_ASSERT.ok( value.navigate_to );
						return;
					} );

				return;
			} );


		//---------------------------------------------------------------------
		describe( `Navigates to HTTPS`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `Navigates to Google (HTTPS)`,
					async function ()
					{
						let value = null;
						value = await this.Puppet.navigate_to( "https://google.com" );
						LIB_ASSERT.ok( value.navigate_to );
						return;
					} );

				//---------------------------------------------------------------------
				it( `Navigates to Wikipedia (HTTPS)`,
					async function ()
					{
						let value = null;
						value = await this.Puppet.navigate_to( "https://en.wikipedia.org/wiki/Main_Page" );
						LIB_ASSERT.ok( value.navigate_to );
						return;
					} );

				return;
			} );


		//---------------------------------------------------------------------
		describe( `Multiple Pages`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `Navigates and gets page info`,
					async function ()
					{
						let value = null;
						value = await this.Puppet.navigate_to( "https://google.com" );
						LIB_ASSERT.ok( value.navigate_to );
						value = await this.Puppet.get_pages();
						LIB_ASSERT.ok( value.get_pages );
						LIB_ASSERT.ok( value.pages );
						LIB_ASSERT.strictEqual( value.pages.length, 1 );
						LIB_ASSERT.strictEqual( value.pages[ 0 ].url, "https://www.google.com/" );
						return;
					} );

				return;
			} );


		return;
	} );

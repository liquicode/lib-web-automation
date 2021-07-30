"use strict";


//=====================================================================
//=====================================================================
//
//		puppeteer-page-content.js
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
// Page Content
exports.find_element = find_element;
exports.modelize = modelize;
exports.get_text = get_text;
exports.get_table = get_table;
exports.get_image = get_image;


//=====================================================================
//=====================================================================
//
//		Find Element
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function find_element( Puppet, Selector )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let element = null;
	if ( Selector.startsWith( 'xpath:' ) )
	{
		Selector = Selector.substr( 6 ).trim();
		element = await Puppet.PuppeteerPage.$x( Selector );
	}
	else if ( Selector.startsWith( 'css:' ) )
	{
		Selector = Selector.substr( 4 ).trim();
		element = await Puppet.PuppeteerPage.$( Selector );
	}
	else
	{
		Selector = Selector.trim();
		element = await Puppet.PuppeteerPage.$( Selector );
	}
	if ( Array.isArray( element ) ) { element = element[ 0 ]; }

	return {
		find_element: true,
		element: element,
	};
}


//=====================================================================
//=====================================================================
//
//		Modelize
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function modelize( Puppet, Selector )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await Puppet.find_element( Puppet, Selector );
	if ( result.error ) { return result; }
	if ( !result.element ) { throw new Error( `Selector [${Selector}] does not exist.` ); }
	let element = result.element;

	let model = await Puppet.PuppeteerPage.evaluate( ( eval_element ) =>
	{
		function get_model_from_element( element )
		{
			let model = {};
			model.innerText = element.innerText;
			model.nodeName = element.nodeName;
			model.nodeType = '';
			if ( element.nodeType === 1 )
			{ model.nodeType = 'element'; }
			else if ( element.nodeType === 2 )
			{ model.nodeType = 'attribute'; }
			else if ( element.nodeType === 3 )
			{ model.nodeType = 'text'; }
			else if ( element.nodeType === 4 )
			{ model.nodeType = 'comment'; }
			// model.nodeValue = element.nodeValue;
			// model.innerText = element.innerText;
			// model.className = element.className;

			model.attributes = {};
			for ( let index = 0; index < element.attributes.length; index++ )
			{
				let attribute = element.attributes[ index ];
				model.attributes[ attribute.name ] = attribute.value;
				continue;
			}

			model.children = [];
			for ( let index = 0; index < element.children.length; index++ )
			{
				model.children.push( get_model_from_element( element.children[ index ] ) );
			}

			if ( model.children.length === 0 )
			{
				model.text = element.innerText;
			}
			return model;
		}
		return get_model_from_element( eval_element );
	}, element );

	return {
		modelize: true,
		model: model,
	};
}


//=====================================================================
//=====================================================================
//
//		Get Text
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_text( Puppet, Selector )
{
	if ( !Puppet.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !Puppet.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await Puppet.find_element( Puppet, Selector );
	if ( result.error ) { return result; }
	if ( !result.element ) { throw new Error( `Selector [${Selector}] does not exist.` ); }
	let element = result.element;

	let content = await element.getProperty( 'textContent' );
	let text = await content.jsonValue();

	// Return the data
	return {
		get_text: true,
		text: text,
	};
}


//=====================================================================
//=====================================================================
//
//		Get Table
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_table( App, Selector )
{
	if ( !App.PuppeteerBrowser ) { return { error: 'Browser does not exist.' }; }
	if ( !App.PuppeteerPage ) { return { error: 'Page does not exist.' }; }

	let result = await App.libPuppeteer.find_element( App, Selector );
	if ( result.error ) { return result; }
	if ( !result.element ) { throw new Error( `Selector [${Selector}] does not exist.` ); }
	let element = result.element;

	let table = [];
	let html_rows = await element.$$( 'tr' );
	for ( let html_row_index = 0; html_row_index < html_rows.length; html_row_index++ )
	{
		let html_cells = await html_rows[ html_row_index ].$$( 'td' );
		if ( html_cells.length === 0 )
		{
			html_cells = await html_rows[ html_row_index ].$$( 'th' );
		}
		let row = [];
		for ( let html_cell_index = 0; html_cell_index < html_cells.length; html_cell_index++ )
		{
			let text_content = await html_cells[ html_cell_index ].getProperty( 'textContent' );
			let text_value = await text_content.jsonValue();
			row.push( text_value );
		}
		table.push( row );
	}

	// Return the data
	return {
		get_table: true,
		table: table,
	};
}


//=====================================================================
//=====================================================================
//
//		Get Image
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
async function get_image( App )
{
	return { get_image: false };
}

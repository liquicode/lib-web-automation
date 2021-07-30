"use strict";


//=====================================================================
//=====================================================================
//
//		lib-utility
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
const LIB_FS = require( 'fs' );
const LIB_CRYPTO = require( 'crypto' );
const LIB_HTTP = require( 'http' );
const LIB_HTTPS = require( 'https' );


//=====================================================================
//=====================================================================
//
//		Module Exports
//
//=====================================================================
//=====================================================================


//---------------------------------------------------------------------
exports.sleep = sleep;
exports.random = random;
exports.unique_id = unique_id;

exports.read_json_file = read_json_file;
exports.write_json_file = write_json_file;

exports.replace_all = replace_all;
exports.escape_string = escape_string;

exports.value_missing_null_empty = value_missing_null_empty;
exports.value_exists = value_exists;

exports.merge_objects = merge_objects;
exports.clone_object = clone_object;

exports.text_compare = text_compare;
exports.text_compare_case_insensitive = text_compare_case_insensitive;

exports.path_parent_name = path_parent_name;

exports.get_url = get_url;

exports.lib_missing_error = lib_missing_error;


//---------------------------------------------------------------------
async function sleep( Milliseconds )
{
	return new Promise( resolve => setTimeout( resolve, Milliseconds ) );
};


//---------------------------------------------------------------------
function random( Min, Max )
{
	let range = ( Max - Min ) + 1;
	return Math.floor( ( Math.random() * range ) + Min );
};


//---------------------------------------------------------------------
function unique_id( Size = 12 )
{
	let alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let alphabet_1st = 'abcdefghijklmnopqrstuvwxyz';
	let result = '';
	for ( let index = 0; index < Size; index++ )
	{
		// ALERT: LIB_CRYPTO.randomInt requires Node v14.10.0, v12.19.0
		if ( index === 0 )
		{
			// Make sure the 1st character of the ID is non-numeric.
			result += alphabet_1st[ LIB_CRYPTO.randomInt( 0, alphabet_1st.length - 1 ) ];
		}
		else
		{
			// Use the entire alphabet for the rest of the ID.
			result += alphabet[ LIB_CRYPTO.randomInt( 0, alphabet.length - 1 ) ];
		}
	}
	return result;
};


//---------------------------------------------------------------------
function read_json_file( Filename )
{
	let json = LIB_FS.readFileSync( Filename, 'utf8' );
	let value = JSON.parse( json );
	return value;
};


//---------------------------------------------------------------------
function write_json_file( Filename, Json )
{
	let value = JSON.stringify( Json );
	let json = LIB_FS.writeFileSync( Filename, value );
	return;
};


//---------------------------------------------------------------------
function replace_all( Text, Search, Replace )
{
	while ( Text.indexOf( Search ) >= 0 )
	{
		Text = Text.replace( Search, Replace );
	}
	return Text;
};


//---------------------------------------------------------------------
function escape_string( S, Char )
{
	return replace_all( S, Char, `\\${Char}` );
};


//---------------------------------------------------------------------
function value_missing_null_empty( Value )
{
	switch ( typeof Value )
	{
		case 'undefined':
			return true;
		case 'string':
			if ( Value.length === 0 ) { return true; }
		case 'object':
			if ( Value === null ) { return true; }
			if ( Object.keys( Value ).length === 0 ) { return true; }
			break;
	}
	return false;
};


//---------------------------------------------------------------------
function value_exists( Value )
{
	return !value_missing_null_empty( Value );
};


// //---------------------------------------------------------------------
// function merge_objects( ObjectA, ObjectB )
// {
// 
// 	let C = clone_object( ObjectA );
// 	function update_children( ParentA, ParentB )
// 	{
// 		Object.keys( ParentB ).forEach(
// 			key =>
// 			{
// 				let value = ParentB[ key ];
// 				if ( typeof ParentA[ key ] === 'undefined' )
// 				{
// 					// Copy the whole branch.
// 					ParentA[ key ] = clone_object( value );
// 				}
// 				else
// 				{
// 					if ( typeof value === 'object' )
// 					{
// 						if ( value === null )
// 						{
// 							// Assign null.
// 							ParentA[ key ] = null;
// 						}
// 						else if ( Array.isArray( value ) )
// 						{
// 							// Clone the array.
// 							ParentA[ key ] = clone_object( value );
// 						}
// 						else
// 						{
// 							// Merge sub-objects.
// 							update_children( ParentA[ key ], value );
// 						}
// 					}
// 					else
// 					{
// 						// Overwrite values.
// 						ParentA[ key ] = clone_object( value );
// 					}
// 				}
// 			} );
// 	}
// 
// 	update_children( C, ObjectB );
// 	return C;
// };


//---------------------------------------------------------------------
function merge_objects( A, B )
{
	let C = clone_object( A );

	function update_children( ParentA, ParentB )
	{
		Object.keys( ParentB ).forEach(
			key =>
			{
				let value_a = ParentA[ key ];
				let value_b = ParentB[ key ];
				let type_a = typeof value_a;
				let type_b = typeof value_b;
				if ( type_a === 'undefined' )
				{
					// Initialize with the entire value.
					ParentA[ key ] = clone_object( value_b );
				}
				else
				{
					if ( type_b === 'object' )
					{
						if ( Array.isArray( value_a ) )
						{
							// Append the array.
							// ParentA[ key ] = clone_object( value );
							ParentA[ key ].push( ...clone_object( value_b ) );
						}
						else if ( value_b === null )
						{
							// Overwrite with null.
							ParentA[ key ] = null;
						}
						else
						{
							// Merge sub-objects.
							update_children( ParentA[ key ], value_b );
						}
					}
					else
					{
						// Overwrite with value.
						ParentA[ key ] = clone_object( value_b );
					}
				}
			} );
	}

	update_children( C, B );
	return C;
}


//---------------------------------------------------------------------
function clone_object( Value )
{
	return JSON.parse( JSON.stringify( Value ) );
};


//---------------------------------------------------------------------
function text_compare( A, B )
{
	return A == B ? 0 : A > B ? 1 : -1;
};


//---------------------------------------------------------------------
function text_compare_case_insensitive( A, B )
{
	let a = A.toLowerCase();
	let b = B.toLowerCase();
	return a == b ? 0 : a > b ? 1 : -1;
};


//---------------------------------------------------------------------
/**
 * Breaks a path into these components:
 * 	- path: full path to this item
 * 	- parent: parent's name only
 * 	- name: this name only
 * @param {string} path 
 */
function path_parent_name( path )
{
	let ppn = {
		type: '',
		path: path,
		delimiter: '',
		parent: '',
		name: '',
	};

	if ( ppn.path.startsWith( 'stores:' ) )
	{
		ppn.type = 'stores';
		ppn.path = ppn.path.substr( 7 );
	}
	else if ( ppn.path.startsWith( 'views:' ) )
	{
		ppn.type = 'views';
		ppn.path = ppn.path.substr( 6 );
	}

	// if ( !path || !path.length ) { throw new Error( `The [path] parameter is required and must be a string.` ); }
	ppn.delimiter = ppn.path.substr( 0, 1 );
	let path_names = ppn.path.split( ppn.delimiter );
	ppn.name = path_names.pop();
	ppn.parent = path_names.join( ppn.delimiter );

	if (
		( ppn.path === ppn.delimiter )
		&& ( ppn.parent === '' )
		&& ( ppn.name === '' ) )
	{
		// Special Case: Represent the delimiter as the root.
		ppn.name = ppn.delimiter;
	}
	else if ( ppn.parent === '' )
	{
		// Special Case: Represent the actual root as a child of the delimiter.
		ppn.parent = ppn.delimiter;
	}

	return ppn;
}


//---------------------------------------------------------------------
// FROM: https://stackoverflow.com/questions/6287297/reading-content-from-url-with-node-js
async function get_url( App, url )
{
	return new Promise( ( resolve, reject ) =>
	{
		let client = null;
		let url_parsed = new URL( url );
		if ( url_parsed.protocol === 'http:' ) { client = LIB_HTTP; }
		else if ( url_parsed.protocol === 'https:' ) { client = LIB_HTTPS; }
		else { throw new Error( `Unknown protocol in [${url}]` ); }
		let options =
		{
			method: 'GET',
			headers:
			{
				'Accept': '*/*',
			},
		};
		client
			.request( url, options,
				( response ) =>
				{
					let chunks = [];
					// A chunk of data has been recieved.
					response.on( 'data',
						( chunk ) => 
						{
							chunks.push( chunk );
						} );
					// The whole response has been received. Print out the result.
					response.on( 'end',
						() => 
						{
							let buffer = Buffer.concat( chunks );
							let content = buffer.toString( 'utf-8' );
							resolve( content );
						} );
				} )
			.on( "error",
				( err ) =>
				{
					reject( err );
				} );
	} );
}


//---------------------------------------------------------------------
function lib_missing_error( LibraryName )
{
	console.error( `LIB-WEB-AUTOMATION: An npm library required for this service provider [${LibraryName}] was not found.` );
	console.error( `LIB-WEB-AUTOMATION: The npm library [${LibraryName}] was not found.` );
	console.error( `LIB-WEB-AUTOMATION: To install [${LibraryName}] please use: npm install --save ${LibraryName}` );
	return;
}

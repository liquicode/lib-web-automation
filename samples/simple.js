"use strict";

const LIB_WEB_AUTOMATION = require( '../src/lib-web-automation.js' );
var puppet = LIB_WEB_AUTOMATION.Puppet();

let value = null;
value = puppet.start_session();
value = puppet.get_session_status();
value = puppet.end_session();

process.exit();

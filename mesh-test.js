;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var oembed = require('./oembed.js');

},{"./oembed.js":2}],2:[function(require,module,exports){
var oembed = require('../src/oembed.js');

var url =
    'http://www.flickr.com/photos/'
        + '38181364@N03/9150363825/in/explore-2013-06-27';

console.log(oembed);

var provider = oembed.getProviderFor(url);

console.log(provider);

oembed.request(url, function(err, data) {
  if (err)
    throw err;

  console.log(data);
});

},{"../src/oembed.js":3}],3:[function(require,module,exports){
var oembed = module.exports = {};

var $ = require('../jquery/jquery-1.4.2.js');

var providers = require('./oembed-providers.js');

oembed.getProviderFor = function getProviderFor(url) {
  var i;
  for (i = 0; i < providers.length; i++) {
    var provider = providers[i];
    var pattern = '^' + provider.scheme.replace('*', '.+') + '$';
    var regex = new RegExp(pattern);
    var match = regex.exec(url);
    if (match) {
      return provider;
    }
  }

  return null;
};

oembed.request = function request(url, callback) {
  var provider = oembed.getProviderFor(url);
  if (provider === null)
    return callback(new Error('not embeddable'));

  var requestURL = provider.endpoint + '?url=' + encodeURIComponent(url);

  console.log(requestURL);

  $.getJSON(requestURL + '?callback=?', {
    jsonp : 'jsonp'
  }, function() {
    console.log(arguments);
  });
};

oembed.discover = function discover(url, callback) {
  // does nothing at the moment
};

},{"./oembed-providers.js":4,"../jquery/jquery-1.4.2.js":5}],4:[function(require,module,exports){
module.exports = [ {
  scheme : 'http://www.flickr.com/photos/*',
  endpoint : 'http://www.flickr.com/services/oembed.json'
} ];

},{}],5:[function(require,module,exports){
(function(){/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
(function( window, undefined ) {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for
                        // #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and
                                        // it's a single tag
					// just do a createElement and skip the
                                        // rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and
                                                // Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the
                                                // element directly into the
                                                // jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep
        // copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal
                                // values or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
					var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
						: jQuery.isArray(copy) ? [] : {};

					// Never move original objects, clone
                                        // them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Make sure body exists, at least, in case IE gets a
                        // little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return jQuery.ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this
                // event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the
                // constructor property.
		// Make sure that DOM nodes and window objects don't pass
                // through, as well
		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't
                // handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent
                        // an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have
                        // 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original
                // handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		  	[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little
                // overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch( error ) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn, pass ) {
	var length = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
		for ( var k in key ) {
			access( elems, k, key[k], exec, fn, value );
		}
		return elems;
	}
	
	// Setting one attribute
	if ( value !== undefined ) {
		// Optionally, function values get executed if exec is true
		exec = !pass && exec && jQuery.isFunction(value);
		
		for ( var i = 0; i < length; i++ ) {
			fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
		}
		
		return elems;
	}
	
	// Getting an attribute
	return length ? fn( elems[0], key ) : undefined;
}

function now() {
	return (new Date).getTime();
}
(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by
                // innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working
                // selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in
                // an optgroup)
		optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

		parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,

		// Will be defined later
		deleteExpando: true,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;
	
	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';

		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		"object": true,
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		if ( !id && typeof name === "string" && data === undefined ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			elem[ expando ] = id;
			thisCache = cache[ id ] = jQuery.extend(true, {}, name);

		} else if ( !cache[ id ] ) {
			elem[ expando ] = id;
			cache[ id ] = {};
		}

		thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the
                                // element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});
jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a
                // lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress
                // sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from
                        // being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i, elem ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});
var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(rspace);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space
                                        // seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value
                                                        // for the option
							value = jQuery(option).val();

							// We don't need an
                                                        // array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return
                                                        // an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is
                                // returned instead of "on" if a value isn't
                                // specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Typecast each time if the value is a Function and the
                        // appended
			// value is therefore different each time.
			if ( typeof val === "number" ) {
				val += "";
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for
                // style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of
                        // an option
			// Accessing the parent's selectedIndex property fixes
                        // it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with
                                        // optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to
                                        // be changed (since it causes problems
                                        // in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms,
                                // give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the
                                // correct value when it hasn't been explicitly
                                // set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers
                                // do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special
                                        // call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to
                        // undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated.
                // Use style instead.
		return jQuery.style( elem, name, value );
	}
});
var rnamespaces = /\.(.*)$/,
	fcleanup = function( nm ) {
		return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
			return "\\" + ch;
		});
	};

/*
 * A number of helper functions used for managing events. Many of the ideas
 * behind this code originated from Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one
                // of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events = elemData.events || {},
			eventHandle = elemData.handle, eventHandle;

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in
                // IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			handleObj.guid = handler.guid;

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the
                                // special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the
                                        // element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global
                        // triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var ret, type, fn, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)")
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( var j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( var j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the
                                        // given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers
                        // exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /* , bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to
                                // avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for
                                // it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
				}
			}

		// prevent IE from throwing an error for some elements with some
                // event types, see #3533
		} catch (e) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old,
				isClick = jQuery.nodeName(target, "a") && type === "click",
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ type ] ) {
						// Make sure that we don't
                                                // accidentally re-trigger the
                                                // onFOO events
						old = target[ "on" + type ];

						if ( old ) {
							target[ "on" + type ] = null;
						}

						jQuery.event.triggered = true;
						target[ type ]();
					}

				// prevent IE from throwing an error for some
                                // elements with some event types, see #3533
				} catch (e) {}

				if ( old ) {
					target[ "on" + type ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace, events;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		var events = jQuery.data(this, "events"), handlers = events[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler
                                        // function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, arguments );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes
                                                                      // #1925
                                                                      // where
                                                                      // srcElement
                                                                      // might
                                                                      // not be
                                                                      // defined
                                                                      // either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta
                // for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) ); 
			},

			remove: function( handleObj ) {
				var remove = true,
					type = handleObj.origType.replace(rnamespaces, "");
				
				jQuery.each( jQuery.data(this, "events").live || [], function() {
					if ( type === this.origType.replace(rnamespaces, "") ) {
						remove = false;
						return false;
					}
				});

				if ( remove ) {
					jQuery.event.remove( this, handleObj.origType, liveHandler );
				}
			}

		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on
                                // windows
				if ( this.setInterval ) {
					this.onbeforeunload = eventHandle;
				}

				return false;
			},
			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

var removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		elem.removeEventListener( type, handle, false );
	} : 
	function( elem, type, handle ) {
		elem.detachEvent( "on" + type, handle );
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language
// Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event
                // to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event
                // to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non
                        // sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul
        // element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var formElems = /textarea|input|select/i,

	changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used
                        // in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous
                        // element is blurred
			// with this event you can't trigger a change event, but
                        // you can store
			// information/focus[in] is not needed anymore
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return formElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return formElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click
                // handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /*
                                                                     * Internal
                                                                     * Use Only
                                                                     */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				context.each(function(){
					jQuery.event.add( this, liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				});

			} else {
				// unbind live handler
				context.unbind( liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	}
});

function liveHandler( event ) {
	var stop, elems = [], selectors = [], args = arguments,
		related, match, handleObj, elem, j, i, l, data,
		events = jQuery.data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( match[i].selector === handleObj.selector ) {
				elem = match[i].elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		if ( match.handleObj.origHandler.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return "live." + (type && type !== "*" ? type + "." : "") + selector.replace(/\./g, "`").replace(/ /g, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
// - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	window.attachEvent("onunload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being
                                // unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}
/*
 * ! Sizzle CSS Selector Engine - v1.0 Copyright 2009, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses. More information:
 * http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
// Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is
                // an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5',
                                // '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last)
                                // including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression,
                                // or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
		return "\\" + (num - 0 + 1);
	}));
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it
        // quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = getText;
jQuery.isXMLDoc = isXML;
jQuery.contains = contains;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function( i, cur ) {
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is
                        // used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<script|<object|<embed|<option|<style/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,  // checked="checked"
                                                          // or checked (html5)
	fcloseTag = function( all, front, tag ) {
		return rselfClosing.test( tag ) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ), contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the
                                // orignal
				// In order to get around this, we use
                                // innerHTML.
				// Unfortunately, this means some modifications
                                // to
				// attributes in IE that are actually only
                                // stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where
                                        // action=/test/> self-closes a tag
					.replace(/=([^="'>\s]+\/)>/g, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, fcloseTag);

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent
                                        // memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the
                        // fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery(this), old = self.html();
				self.empty().append(function(){
					return value.call( this, i, old );
				});
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM
                        // before they are inserted
			// this can help fix replacing a parent with child
                        // elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery(value).detach();
			}

			return this.each(function() {
				var next = this.nextSibling, parent = this.parentNode;

				jQuery(this).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [], fragment, parent;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of
                        // building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

function buildFragment( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main
        // document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a
        // fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so
        // don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns
                // typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work
                                // as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra
                                // wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table
                                // fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have
                                        // spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare
                                                        // <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when
                                // innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display:"block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if ( value === undefined ) {
			return jQuery.curCSS( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not
                                // have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
				"";
		}

		// Make sure we're using the right name for getting the float
                // value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) {
					return;
				}

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float
                // value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = elem.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to
                        // convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value
                                // out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct
        // calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return _load.call( this, url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the
                                // matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold
                                                // the results
						jQuery("<div />")
							// inject the contents
                                                        // of the document in,
                                                        // removing the scripts
							// to avoid any
                                                        // 'Permission Denied'
                                                        // errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified
                                                        // elements
							.find(selector) :

						// If not, just inject the full
                                                // result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
                 * timeout: 0, data: null, username: null, password: null,
                 * traditional: false,
                 */
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7 (can't request local
                // files),
		// so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
		
		var jsonp, status, data,
			callbackContext = origSettings && origSettings.context || s,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and
                        // the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				} catch(e) {}

				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild to circumvent
                        // an IE6 bug.
			// This arises when a base node is used (#2709 and
                        // #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element
                        // injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera
                // (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox
                // 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data || origSettings && origSettings.contentType ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match
                        // header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an
                        // XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on
                        // the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before
                                // this point
				// so we simulate the call
				if ( !requestDone ) {
					complete();
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available,
                        // or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document
                                        // parse errors
					try {
						// process the data (runs the
                                                // xml through httpData
                                                // regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(err) {
						status = "parsererror";
						errMsg = err;
					}
				}

				// Make sure that the request was successful or
                                // notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success
                                        // callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status, errMsg);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE doesn't allow it,
                // but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					oldAbort.call( xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch(e) { }

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still
                                // happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success() {
			// If a local callback was specified, fire it and pass
                        // it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete() {
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204
                        // so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form
                // elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2
                        // or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix] );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

		function buildParams( prefix, obj ) {
			if ( jQuery.isArray(obj) ) {
				// Serialize array item.
				jQuery.each( obj, function( i, v ) {
					if ( traditional || /\[\]$/.test( prefix ) ) {
						// Treat each array item as a
                                                // scalar.
						add( prefix, v );
					} else {
						// If array item is non-scalar
                                                // (array or object), encode its
						// numeric index to resolve
                                                // deserialization ambiguity
                                                // issues.
						// Note that rack (as of 1.0.0)
                                                // can't currently deserialize
						// nested arrays properly, and
                                                // attempting to do so may cause
						// a server error. Possible
                                                // fixes are to modify rack's
						// deserialization algorithm or
                                                // to provide an option or flag
						// to force array serialization
                                                // to be shallow.
						buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
					}
				});
					
			} else if ( !traditional && obj != null && typeof obj === "object" ) {
				// Serialize object item.
				jQuery.each( obj, function( k, v ) {
					buildParams( prefix + "[" + k + "]", v );
				});
					
			} else {
				// Serialize scalar item.
				add( prefix, obj );
			}
		}

		function add( key, value ) {
			// If value is a function, invoke it and return its
                        // value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		}
	}
});
var elemdisplay = {},
	rfxtypes = /toggle|show|hide/,
	rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed || speed === 0) {
			return this.animate( genFx("show", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];

					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");

						if ( display === "none" ) {
							display = "block";
						}

						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ) {
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2);
		}

		return this;
	},

	fadeTo: function( speed, to, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( ( p === "height" || p === "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to
                                        // specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting
                                                // value
						if ( unit !== "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was
                                                // provided, we're doing a
                                                // relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue
                        // during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the
                                                // last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, callback ) {
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function( force ) {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					var old = jQuery.data(this.elem, "olddisplay");
					this.elem.style.display = old ? old : this.options.display;

					if ( jQuery.css(this.elem, "display") === "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was
                                // done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been
                                // hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds: {
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		// set position first, in-case top/left are set even on static
                // elem
		if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		var props = {
			top:  (options.top  - curOffset.top)  + curTop,
			left: (options.left - curOffset.left) + curLeft
		};
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and
                // marginLeft
		// are the same in Safari causing offset.left to incorrectly be
                // 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		return ("scrollTo" in elem && elem.document) ? // does it walk
                                                                // and quack
                                                                // like a
                                                                // window?
			// Everyone else use document.documentElement or
                        // document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or
                                // offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the
                                        // element (default to pixels if value
                                        // is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});

// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

if (typeof module !== 'undefined')
  module.exports = jQuery;

})(this);

})()
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJjOlxcRGV2XFxQYWxhc3Rob3RlbFxcbWVzaFxcdGVzdFxcbWFpbi5qcyIsImM6XFxEZXZcXFBhbGFzdGhvdGVsXFxtZXNoXFx0ZXN0XFxvZW1iZWQuanMiLCJjOlxcRGV2XFxQYWxhc3Rob3RlbFxcbWVzaFxcc3JjXFxvZW1iZWQuanMiLCJjOlxcRGV2XFxQYWxhc3Rob3RlbFxcbWVzaFxcc3JjXFxvZW1iZWQtcHJvdmlkZXJzLmpzIiwiYzpcXERldlxcUGFsYXN0aG90ZWxcXG1lc2hcXGpxdWVyeVxcanF1ZXJ5LTEuNC4yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBvZW1iZWQgPSByZXF1aXJlKCcuL29lbWJlZC5qcycpO1xuIiwidmFyIG9lbWJlZCA9IHJlcXVpcmUoJy4uL3NyYy9vZW1iZWQuanMnKTtcblxudmFyIHVybCA9XG4gICAgJ2h0dHA6Ly93d3cuZmxpY2tyLmNvbS9waG90b3MvJ1xuICAgICAgICArICczODE4MTM2NEBOMDMvOTE1MDM2MzgyNS9pbi9leHBsb3JlLTIwMTMtMDYtMjcnO1xuXG5jb25zb2xlLmxvZyhvZW1iZWQpO1xuXG52YXIgcHJvdmlkZXIgPSBvZW1iZWQuZ2V0UHJvdmlkZXJGb3IodXJsKTtcblxuY29uc29sZS5sb2cocHJvdmlkZXIpO1xuXG5vZW1iZWQucmVxdWVzdCh1cmwsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICBpZiAoZXJyKVxuICAgIHRocm93IGVycjtcblxuICBjb25zb2xlLmxvZyhkYXRhKTtcbn0pO1xuIiwidmFyIG9lbWJlZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciAkID0gcmVxdWlyZSgnLi4vanF1ZXJ5L2pxdWVyeS0xLjQuMi5qcycpO1xuXG52YXIgcHJvdmlkZXJzID0gcmVxdWlyZSgnLi9vZW1iZWQtcHJvdmlkZXJzLmpzJyk7XG5cbm9lbWJlZC5nZXRQcm92aWRlckZvciA9IGZ1bmN0aW9uIGdldFByb3ZpZGVyRm9yKHVybCkge1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IHByb3ZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwcm92aWRlciA9IHByb3ZpZGVyc1tpXTtcbiAgICB2YXIgcGF0dGVybiA9ICdeJyArIHByb3ZpZGVyLnNjaGVtZS5yZXBsYWNlKCcqJywgJy4rJykgKyAnJCc7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChwYXR0ZXJuKTtcbiAgICB2YXIgbWF0Y2ggPSByZWdleC5leGVjKHVybCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5vZW1iZWQucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QodXJsLCBjYWxsYmFjaykge1xuICB2YXIgcHJvdmlkZXIgPSBvZW1iZWQuZ2V0UHJvdmlkZXJGb3IodXJsKTtcbiAgaWYgKHByb3ZpZGVyID09PSBudWxsKVxuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ25vdCBlbWJlZGRhYmxlJykpO1xuXG4gIHZhciByZXF1ZXN0VVJMID0gcHJvdmlkZXIuZW5kcG9pbnQgKyAnP3VybD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybCk7XG5cbiAgY29uc29sZS5sb2cocmVxdWVzdFVSTCk7XG5cbiAgJC5nZXRKU09OKHJlcXVlc3RVUkwgKyAnP2NhbGxiYWNrPT8nLCB7XG4gICAganNvbnAgOiAnanNvbnAnXG4gIH0sIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gIH0pO1xufTtcblxub2VtYmVkLmRpc2NvdmVyID0gZnVuY3Rpb24gZGlzY292ZXIodXJsLCBjYWxsYmFjaykge1xuICAvLyBkb2VzIG5vdGhpbmcgYXQgdGhlIG1vbWVudFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gWyB7XG4gIHNjaGVtZSA6ICdodHRwOi8vd3d3LmZsaWNrci5jb20vcGhvdG9zLyonLFxuICBlbmRwb2ludCA6ICdodHRwOi8vd3d3LmZsaWNrci5jb20vc2VydmljZXMvb2VtYmVkLmpzb24nXG59IF07XG4iLCIoZnVuY3Rpb24oKXsvKiFcbiAqIGpRdWVyeSBKYXZhU2NyaXB0IExpYnJhcnkgdjEuNC4yXG4gKiBodHRwOi8vanF1ZXJ5LmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgMjAxMCwgSm9obiBSZXNpZ1xuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIG9yIEdQTCBWZXJzaW9uIDIgbGljZW5zZXMuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogSW5jbHVkZXMgU2l6emxlLmpzXG4gKiBodHRwOi8vc2l6emxlanMuY29tL1xuICogQ29weXJpZ2h0IDIwMTAsIFRoZSBEb2pvIEZvdW5kYXRpb25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQsIEJTRCwgYW5kIEdQTCBMaWNlbnNlcy5cbiAqXG4gKiBEYXRlOiBTYXQgRmViIDEzIDIyOjMzOjQ4IDIwMTAgLTA1MDBcbiAqL1xuKGZ1bmN0aW9uKCB3aW5kb3csIHVuZGVmaW5lZCApIHtcblxuLy8gRGVmaW5lIGEgbG9jYWwgY29weSBvZiBqUXVlcnlcbnZhciBqUXVlcnkgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG5cdFx0Ly8gVGhlIGpRdWVyeSBvYmplY3QgaXMgYWN0dWFsbHkganVzdCB0aGUgaW5pdCBjb25zdHJ1Y3RvciAnZW5oYW5jZWQnXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuZm4uaW5pdCggc2VsZWN0b3IsIGNvbnRleHQgKTtcblx0fSxcblxuXHQvLyBNYXAgb3ZlciBqUXVlcnkgaW4gY2FzZSBvZiBvdmVyd3JpdGVcblx0X2pRdWVyeSA9IHdpbmRvdy5qUXVlcnksXG5cblx0Ly8gTWFwIG92ZXIgdGhlICQgaW4gY2FzZSBvZiBvdmVyd3JpdGVcblx0XyQgPSB3aW5kb3cuJCxcblxuXHQvLyBVc2UgdGhlIGNvcnJlY3QgZG9jdW1lbnQgYWNjb3JkaW5nbHkgd2l0aCB3aW5kb3cgYXJndW1lbnQgKHNhbmRib3gpXG5cdGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuXG5cdC8vIEEgY2VudHJhbCByZWZlcmVuY2UgdG8gdGhlIHJvb3QgalF1ZXJ5KGRvY3VtZW50KVxuXHRyb290alF1ZXJ5LFxuXG5cdC8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzIG9yIElEIHN0cmluZ3Ncblx0Ly8gKGJvdGggb2Ygd2hpY2ggd2Ugb3B0aW1pemUgZm9yKVxuXHRxdWlja0V4cHIgPSAvXltePF0qKDxbXFx3XFxXXSs+KVtePl0qJHxeIyhbXFx3LV0rKSQvLFxuXG5cdC8vIElzIGl0IGEgc2ltcGxlIHNlbGVjdG9yXG5cdGlzU2ltcGxlID0gL14uW146I1xcW1xcLixdKiQvLFxuXG5cdC8vIENoZWNrIGlmIGEgc3RyaW5nIGhhcyBhIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBpbiBpdFxuXHRybm90d2hpdGUgPSAvXFxTLyxcblxuXHQvLyBVc2VkIGZvciB0cmltbWluZyB3aGl0ZXNwYWNlXG5cdHJ0cmltID0gL14oXFxzfFxcdTAwQTApK3woXFxzfFxcdTAwQTApKyQvZyxcblxuXHQvLyBNYXRjaCBhIHN0YW5kYWxvbmUgdGFnXG5cdHJzaW5nbGVUYWcgPSAvXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPik/JC8sXG5cblx0Ly8gS2VlcCBhIFVzZXJBZ2VudCBzdHJpbmcgZm9yIHVzZSB3aXRoIGpRdWVyeS5icm93c2VyXG5cdHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG5cblx0Ly8gRm9yIG1hdGNoaW5nIHRoZSBlbmdpbmUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXJcblx0YnJvd3Nlck1hdGNoLFxuXHRcblx0Ly8gSGFzIHRoZSByZWFkeSBldmVudHMgYWxyZWFkeSBiZWVuIGJvdW5kP1xuXHRyZWFkeUJvdW5kID0gZmFsc2UsXG5cdFxuXHQvLyBUaGUgZnVuY3Rpb25zIHRvIGV4ZWN1dGUgb24gRE9NIHJlYWR5XG5cdHJlYWR5TGlzdCA9IFtdLFxuXG5cdC8vIFRoZSByZWFkeSBldmVudCBoYW5kbGVyXG5cdERPTUNvbnRlbnRMb2FkZWQsXG5cblx0Ly8gU2F2ZSBhIHJlZmVyZW5jZSB0byBzb21lIGNvcmUgbWV0aG9kc1xuXHR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcblx0cHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoLFxuXHRzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcblx0aW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuXG5qUXVlcnkuZm4gPSBqUXVlcnkucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG5cdFx0dmFyIG1hdGNoLCBlbGVtLCByZXQsIGRvYztcblxuXHRcdC8vIEhhbmRsZSAkKFwiXCIpLCAkKG51bGwpLCBvciAkKHVuZGVmaW5lZClcblx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSAkKERPTUVsZW1lbnQpXG5cdFx0aWYgKCBzZWxlY3Rvci5ub2RlVHlwZSApIHtcblx0XHRcdHRoaXMuY29udGV4dCA9IHRoaXNbMF0gPSBzZWxlY3Rvcjtcblx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHRcblx0XHQvLyBUaGUgYm9keSBlbGVtZW50IG9ubHkgZXhpc3RzIG9uY2UsIG9wdGltaXplIGZpbmRpbmcgaXRcblx0XHRpZiAoIHNlbGVjdG9yID09PSBcImJvZHlcIiAmJiAhY29udGV4dCApIHtcblx0XHRcdHRoaXMuY29udGV4dCA9IGRvY3VtZW50O1xuXHRcdFx0dGhpc1swXSA9IGRvY3VtZW50LmJvZHk7XG5cdFx0XHR0aGlzLnNlbGVjdG9yID0gXCJib2R5XCI7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgSFRNTCBzdHJpbmdzXG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHQvLyBBcmUgd2UgZGVhbGluZyB3aXRoIEhUTUwgc3RyaW5nIG9yIGFuIElEP1xuXHRcdFx0bWF0Y2ggPSBxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKTtcblxuXHRcdFx0Ly8gVmVyaWZ5IGEgbWF0Y2gsIGFuZCB0aGF0IG5vIGNvbnRleHQgd2FzIHNwZWNpZmllZCBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICNpZFxuXHRcdFx0aWYgKCBtYXRjaCAmJiAobWF0Y2hbMV0gfHwgIWNvbnRleHQpICkge1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJChodG1sKSAtPiAkKGFycmF5KVxuXHRcdFx0XHRpZiAoIG1hdGNoWzFdICkge1xuXHRcdFx0XHRcdGRvYyA9IChjb250ZXh0ID8gY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgOiBkb2N1bWVudCk7XG5cblx0XHRcdFx0XHQvLyBJZiBhIHNpbmdsZSBzdHJpbmcgaXMgcGFzc2VkIGluIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0J3MgYSBzaW5nbGUgdGFnXG5cdFx0XHRcdFx0Ly8ganVzdCBkbyBhIGNyZWF0ZUVsZW1lbnQgYW5kIHNraXAgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdFxuXHRcdFx0XHRcdHJldCA9IHJzaW5nbGVUYWcuZXhlYyggc2VsZWN0b3IgKTtcblxuXHRcdFx0XHRcdGlmICggcmV0ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBqUXVlcnkuaXNQbGFpbk9iamVjdCggY29udGV4dCApICkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IFsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggcmV0WzFdICkgXTtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmZuLmF0dHIuY2FsbCggc2VsZWN0b3IsIGNvbnRleHQsIHRydWUgKTtcblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSBbIGRvYy5jcmVhdGVFbGVtZW50KCByZXRbMV0gKSBdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldCA9IGJ1aWxkRnJhZ21lbnQoIFsgbWF0Y2hbMV0gXSwgWyBkb2MgXSApO1xuXHRcdFx0XHRcdFx0c2VsZWN0b3IgPSAocmV0LmNhY2hlYWJsZSA/IHJldC5mcmFnbWVudC5jbG9uZU5vZGUodHJ1ZSkgOiByZXQuZnJhZ21lbnQpLmNoaWxkTm9kZXM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBqUXVlcnkubWVyZ2UoIHRoaXMsIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdC8vIEhBTkRMRTogJChcIiNpZFwiKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbWF0Y2hbMl0gKTtcblxuXHRcdFx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0XHRcdC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSBJRSBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIHJldHVybiBpdGVtc1xuXHRcdFx0XHRcdFx0Ly8gYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgIT09IG1hdGNoWzJdICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcm9vdGpRdWVyeS5maW5kKCBzZWxlY3RvciApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBPdGhlcndpc2UsIHdlIGluamVjdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgZGlyZWN0bHkgaW50byB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpRdWVyeSBvYmplY3Rcblx0XHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdFx0XHRcdHRoaXNbMF0gPSBlbGVtO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuY29udGV4dCA9IGRvY3VtZW50O1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBIQU5ETEU6ICQoXCJUQUdcIilcblx0XHRcdH0gZWxzZSBpZiAoICFjb250ZXh0ICYmIC9eXFx3KyQvLnRlc3QoIHNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0dGhpcy5jb250ZXh0ID0gZG9jdW1lbnQ7XG5cdFx0XHRcdHNlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdHJldHVybiBqUXVlcnkubWVyZ2UoIHRoaXMsIHNlbGVjdG9yICk7XG5cblx0XHRcdC8vIEhBTkRMRTogJChleHByLCAkKC4uLikpXG5cdFx0XHR9IGVsc2UgaWYgKCAhY29udGV4dCB8fCBjb250ZXh0LmpxdWVyeSApIHtcblx0XHRcdFx0cmV0dXJuIChjb250ZXh0IHx8IHJvb3RqUXVlcnkpLmZpbmQoIHNlbGVjdG9yICk7XG5cblx0XHRcdC8vIEhBTkRMRTogJChleHByLCBjb250ZXh0KVxuXHRcdFx0Ly8gKHdoaWNoIGlzIGp1c3QgZXF1aXZhbGVudCB0bzogJChjb250ZXh0KS5maW5kKGV4cHIpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4galF1ZXJ5KCBjb250ZXh0ICkuZmluZCggc2VsZWN0b3IgKTtcblx0XHRcdH1cblxuXHRcdC8vIEhBTkRMRTogJChmdW5jdGlvbilcblx0XHQvLyBTaG9ydGN1dCBmb3IgZG9jdW1lbnQgcmVhZHlcblx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2VsZWN0b3IgKSApIHtcblx0XHRcdHJldHVybiByb290alF1ZXJ5LnJlYWR5KCBzZWxlY3RvciApO1xuXHRcdH1cblxuXHRcdGlmIChzZWxlY3Rvci5zZWxlY3RvciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3Iuc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBzZWxlY3Rvci5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkubWFrZUFycmF5KCBzZWxlY3RvciwgdGhpcyApO1xuXHR9LFxuXG5cdC8vIFN0YXJ0IHdpdGggYW4gZW1wdHkgc2VsZWN0b3Jcblx0c2VsZWN0b3I6IFwiXCIsXG5cblx0Ly8gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBqUXVlcnkgYmVpbmcgdXNlZFxuXHRqcXVlcnk6IFwiMS40LjJcIixcblxuXHQvLyBUaGUgZGVmYXVsdCBsZW5ndGggb2YgYSBqUXVlcnkgb2JqZWN0IGlzIDBcblx0bGVuZ3RoOiAwLFxuXG5cdC8vIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBtYXRjaGVkIGVsZW1lbnQgc2V0XG5cdHNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmxlbmd0aDtcblx0fSxcblxuXHR0b0FycmF5OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2xpY2UuY2FsbCggdGhpcywgMCApO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgTnRoIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXQgT1Jcblx0Ly8gR2V0IHRoZSB3aG9sZSBtYXRjaGVkIGVsZW1lbnQgc2V0IGFzIGEgY2xlYW4gYXJyYXlcblx0Z2V0OiBmdW5jdGlvbiggbnVtICkge1xuXHRcdHJldHVybiBudW0gPT0gbnVsbCA/XG5cblx0XHRcdC8vIFJldHVybiBhICdjbGVhbicgYXJyYXlcblx0XHRcdHRoaXMudG9BcnJheSgpIDpcblxuXHRcdFx0Ly8gUmV0dXJuIGp1c3QgdGhlIG9iamVjdFxuXHRcdFx0KCBudW0gPCAwID8gdGhpcy5zbGljZShudW0pWyAwIF0gOiB0aGlzWyBudW0gXSApO1xuXHR9LFxuXG5cdC8vIFRha2UgYW4gYXJyYXkgb2YgZWxlbWVudHMgYW5kIHB1c2ggaXQgb250byB0aGUgc3RhY2tcblx0Ly8gKHJldHVybmluZyB0aGUgbmV3IG1hdGNoZWQgZWxlbWVudCBzZXQpXG5cdHB1c2hTdGFjazogZnVuY3Rpb24oIGVsZW1zLCBuYW1lLCBzZWxlY3RvciApIHtcblx0XHQvLyBCdWlsZCBhIG5ldyBqUXVlcnkgbWF0Y2hlZCBlbGVtZW50IHNldFxuXHRcdHZhciByZXQgPSBqUXVlcnkoKTtcblxuXHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIGVsZW1zICkgKSB7XG5cdFx0XHRwdXNoLmFwcGx5KCByZXQsIGVsZW1zICk7XG5cdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpRdWVyeS5tZXJnZSggcmV0LCBlbGVtcyApO1xuXHRcdH1cblxuXHRcdC8vIEFkZCB0aGUgb2xkIG9iamVjdCBvbnRvIHRoZSBzdGFjayAoYXMgYSByZWZlcmVuY2UpXG5cdFx0cmV0LnByZXZPYmplY3QgPSB0aGlzO1xuXG5cdFx0cmV0LmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cblx0XHRpZiAoIG5hbWUgPT09IFwiZmluZFwiICkge1xuXHRcdFx0cmV0LnNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArICh0aGlzLnNlbGVjdG9yID8gXCIgXCIgOiBcIlwiKSArIHNlbGVjdG9yO1xuXHRcdH0gZWxzZSBpZiAoIG5hbWUgKSB7XG5cdFx0XHRyZXQuc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yICsgXCIuXCIgKyBuYW1lICsgXCIoXCIgKyBzZWxlY3RvciArIFwiKVwiO1xuXHRcdH1cblxuXHRcdC8vIFJldHVybiB0aGUgbmV3bHktZm9ybWVkIGVsZW1lbnQgc2V0XG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvLyBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0LlxuXHQvLyAoWW91IGNhbiBzZWVkIHRoZSBhcmd1bWVudHMgd2l0aCBhbiBhcnJheSBvZiBhcmdzLCBidXQgdGhpcyBpc1xuXHQvLyBvbmx5IHVzZWQgaW50ZXJuYWxseS4pXG5cdGVhY2g6IGZ1bmN0aW9uKCBjYWxsYmFjaywgYXJncyApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmVhY2goIHRoaXMsIGNhbGxiYWNrLCBhcmdzICk7XG5cdH0sXG5cdFxuXHRyZWFkeTogZnVuY3Rpb24oIGZuICkge1xuXHRcdC8vIEF0dGFjaCB0aGUgbGlzdGVuZXJzXG5cdFx0alF1ZXJ5LmJpbmRSZWFkeSgpO1xuXG5cdFx0Ly8gSWYgdGhlIERPTSBpcyBhbHJlYWR5IHJlYWR5XG5cdFx0aWYgKCBqUXVlcnkuaXNSZWFkeSApIHtcblx0XHRcdC8vIEV4ZWN1dGUgdGhlIGZ1bmN0aW9uIGltbWVkaWF0ZWx5XG5cdFx0XHRmbi5jYWxsKCBkb2N1bWVudCwgalF1ZXJ5ICk7XG5cblx0XHQvLyBPdGhlcndpc2UsIHJlbWVtYmVyIHRoZSBmdW5jdGlvbiBmb3IgbGF0ZXJcblx0XHR9IGVsc2UgaWYgKCByZWFkeUxpc3QgKSB7XG5cdFx0XHQvLyBBZGQgdGhlIGZ1bmN0aW9uIHRvIHRoZSB3YWl0IGxpc3Rcblx0XHRcdHJlYWR5TGlzdC5wdXNoKCBmbiApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRcblx0ZXE6IGZ1bmN0aW9uKCBpICkge1xuXHRcdHJldHVybiBpID09PSAtMSA/XG5cdFx0XHR0aGlzLnNsaWNlKCBpICkgOlxuXHRcdFx0dGhpcy5zbGljZSggaSwgK2kgKyAxICk7XG5cdH0sXG5cblx0Zmlyc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmVxKCAwICk7XG5cdH0sXG5cblx0bGFzdDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZXEoIC0xICk7XG5cdH0sXG5cblx0c2xpY2U6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggc2xpY2UuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApLFxuXHRcdFx0XCJzbGljZVwiLCBzbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbihcIixcIikgKTtcblx0fSxcblxuXHRtYXA6IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeS5tYXAodGhpcywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCggZWxlbSwgaSwgZWxlbSApO1xuXHRcdH0pKTtcblx0fSxcblx0XG5cdGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJldk9iamVjdCB8fCBqUXVlcnkobnVsbCk7XG5cdH0sXG5cblx0Ly8gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuXHQvLyBCZWhhdmVzIGxpa2UgYW4gQXJyYXkncyBtZXRob2QsIG5vdCBsaWtlIGEgalF1ZXJ5IG1ldGhvZC5cblx0cHVzaDogcHVzaCxcblx0c29ydDogW10uc29ydCxcblx0c3BsaWNlOiBbXS5zcGxpY2Vcbn07XG5cbi8vIEdpdmUgdGhlIGluaXQgZnVuY3Rpb24gdGhlIGpRdWVyeSBwcm90b3R5cGUgZm9yIGxhdGVyIGluc3RhbnRpYXRpb25cbmpRdWVyeS5mbi5pbml0LnByb3RvdHlwZSA9IGpRdWVyeS5mbjtcblxualF1ZXJ5LmV4dGVuZCA9IGpRdWVyeS5mbi5leHRlbmQgPSBmdW5jdGlvbigpIHtcblx0Ly8gY29weSByZWZlcmVuY2UgdG8gdGFyZ2V0IG9iamVjdFxuXHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LCBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwgZGVlcCA9IGZhbHNlLCBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHk7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAoIHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiICkge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fVxuXG5cdC8vIEhhbmRsZSBjYXNlIHdoZW4gdGFyZ2V0IGlzIGEgc3RyaW5nIG9yIHNvbWV0aGluZyAocG9zc2libGUgaW4gZGVlcFxuICAgICAgICAvLyBjb3B5KVxuXHRpZiAoIHR5cGVvZiB0YXJnZXQgIT09IFwib2JqZWN0XCIgJiYgIWpRdWVyeS5pc0Z1bmN0aW9uKHRhcmdldCkgKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHQvLyBleHRlbmQgalF1ZXJ5IGl0c2VsZiBpZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwYXNzZWRcblx0aWYgKCBsZW5ndGggPT09IGkgKSB7XG5cdFx0dGFyZ2V0ID0gdGhpcztcblx0XHQtLWk7XG5cdH1cblxuXHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKCAob3B0aW9ucyA9IGFyZ3VtZW50c1sgaSBdKSAhPSBudWxsICkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yICggbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbIG5hbWUgXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbIG5hbWUgXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICggdGFyZ2V0ID09PSBjb3B5ICkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIG9iamVjdCBsaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlcyBvciBhcnJheXNcblx0XHRcdFx0aWYgKCBkZWVwICYmIGNvcHkgJiYgKCBqUXVlcnkuaXNQbGFpbk9iamVjdChjb3B5KSB8fCBqUXVlcnkuaXNBcnJheShjb3B5KSApICkge1xuXHRcdFx0XHRcdHZhciBjbG9uZSA9IHNyYyAmJiAoIGpRdWVyeS5pc1BsYWluT2JqZWN0KHNyYykgfHwgalF1ZXJ5LmlzQXJyYXkoc3JjKSApID8gc3JjXG5cdFx0XHRcdFx0XHQ6IGpRdWVyeS5pc0FycmF5KGNvcHkpID8gW10gOiB7fTtcblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRhcmdldFsgbmFtZSBdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0bm9Db25mbGljdDogZnVuY3Rpb24oIGRlZXAgKSB7XG5cdFx0d2luZG93LiQgPSBfJDtcblxuXHRcdGlmICggZGVlcCApIHtcblx0XHRcdHdpbmRvdy5qUXVlcnkgPSBfalF1ZXJ5O1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnk7XG5cdH0sXG5cdFxuXHQvLyBJcyB0aGUgRE9NIHJlYWR5IHRvIGJlIHVzZWQ/IFNldCB0byB0cnVlIG9uY2UgaXQgb2NjdXJzLlxuXHRpc1JlYWR5OiBmYWxzZSxcblx0XG5cdC8vIEhhbmRsZSB3aGVuIHRoZSBET00gaXMgcmVhZHlcblx0cmVhZHk6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBET00gaXMgbm90IGFscmVhZHkgbG9hZGVkXG5cdFx0aWYgKCAhalF1ZXJ5LmlzUmVhZHkgKSB7XG5cdFx0XHQvLyBNYWtlIHN1cmUgYm9keSBleGlzdHMsIGF0IGxlYXN0LCBpbiBjYXNlIElFIGdldHMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGl0dGxlIG92ZXJ6ZWFsb3VzICh0aWNrZXQgIzU0NDMpLlxuXHRcdFx0aWYgKCAhZG9jdW1lbnQuYm9keSApIHtcblx0XHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoIGpRdWVyeS5yZWFkeSwgMTMgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCB0aGUgRE9NIGlzIHJlYWR5XG5cdFx0XHRqUXVlcnkuaXNSZWFkeSA9IHRydWU7XG5cblx0XHRcdC8vIElmIHRoZXJlIGFyZSBmdW5jdGlvbnMgYm91bmQsIHRvIGV4ZWN1dGVcblx0XHRcdGlmICggcmVhZHlMaXN0ICkge1xuXHRcdFx0XHQvLyBFeGVjdXRlIGFsbCBvZiB0aGVtXG5cdFx0XHRcdHZhciBmbiwgaSA9IDA7XG5cdFx0XHRcdHdoaWxlICggKGZuID0gcmVhZHlMaXN0WyBpKysgXSkgKSB7XG5cdFx0XHRcdFx0Zm4uY2FsbCggZG9jdW1lbnQsIGpRdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVzZXQgdGhlIGxpc3Qgb2YgZnVuY3Rpb25zXG5cdFx0XHRcdHJlYWR5TGlzdCA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgYW55IGJvdW5kIHJlYWR5IGV2ZW50c1xuXHRcdFx0aWYgKCBqUXVlcnkuZm4udHJpZ2dlckhhbmRsZXIgKSB7XG5cdFx0XHRcdGpRdWVyeSggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggXCJyZWFkeVwiICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcblx0YmluZFJlYWR5OiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHJlYWR5Qm91bmQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cmVhZHlCb3VuZCA9IHRydWU7XG5cblx0XHQvLyBDYXRjaCBjYXNlcyB3aGVyZSAkKGRvY3VtZW50KS5yZWFkeSgpIGlzIGNhbGxlZCBhZnRlciB0aGVcblx0XHQvLyBicm93c2VyIGV2ZW50IGhhcyBhbHJlYWR5IG9jY3VycmVkLlxuXHRcdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5yZWFkeSgpO1xuXHRcdH1cblxuXHRcdC8vIE1vemlsbGEsIE9wZXJhIGFuZCB3ZWJraXQgbmlnaHRsaWVzIGN1cnJlbnRseSBzdXBwb3J0IHRoaXNcbiAgICAgICAgICAgICAgICAvLyBldmVudFxuXHRcdGlmICggZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdC8vIFVzZSB0aGUgaGFuZHkgZXZlbnQgY2FsbGJhY2tcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBET01Db250ZW50TG9hZGVkLCBmYWxzZSApO1xuXHRcdFx0XG5cdFx0XHQvLyBBIGZhbGxiYWNrIHRvIHdpbmRvdy5vbmxvYWQsIHRoYXQgd2lsbCBhbHdheXMgd29ya1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwibG9hZFwiLCBqUXVlcnkucmVhZHksIGZhbHNlICk7XG5cblx0XHQvLyBJZiBJRSBldmVudCBtb2RlbCBpcyB1c2VkXG5cdFx0fSBlbHNlIGlmICggZG9jdW1lbnQuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHQvLyBlbnN1cmUgZmlyaW5nIGJlZm9yZSBvbmxvYWQsXG5cdFx0XHQvLyBtYXliZSBsYXRlIGJ1dCBzYWZlIGFsc28gZm9yIGlmcmFtZXNcblx0XHRcdGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIERPTUNvbnRlbnRMb2FkZWQpO1xuXHRcdFx0XG5cdFx0XHQvLyBBIGZhbGxiYWNrIHRvIHdpbmRvdy5vbmxvYWQsIHRoYXQgd2lsbCBhbHdheXMgd29ya1xuXHRcdFx0d2luZG93LmF0dGFjaEV2ZW50KCBcIm9ubG9hZFwiLCBqUXVlcnkucmVhZHkgKTtcblxuXHRcdFx0Ly8gSWYgSUUgYW5kIG5vdCBhIGZyYW1lXG5cdFx0XHQvLyBjb250aW51YWxseSBjaGVjayB0byBzZWUgaWYgdGhlIGRvY3VtZW50IGlzIHJlYWR5XG5cdFx0XHR2YXIgdG9wbGV2ZWwgPSBmYWxzZTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9wbGV2ZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50ID09IG51bGw7XG5cdFx0XHR9IGNhdGNoKGUpIHt9XG5cblx0XHRcdGlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICYmIHRvcGxldmVsICkge1xuXHRcdFx0XHRkb1Njcm9sbENoZWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNlZSB0ZXN0L3VuaXQvY29yZS5qcyBmb3IgZGV0YWlscyBjb25jZXJuaW5nIGlzRnVuY3Rpb24uXG5cdC8vIFNpbmNlIHZlcnNpb24gMS4zLCBET00gbWV0aG9kcyBhbmQgZnVuY3Rpb25zIGxpa2UgYWxlcnRcblx0Ly8gYXJlbid0IHN1cHBvcnRlZC4gVGhleSByZXR1cm4gZmFsc2Ugb24gSUUgKCMyOTY4KS5cblx0aXNGdW5jdGlvbjogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG5cdH0sXG5cblx0aXNBcnJheTogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgQXJyYXldXCI7XG5cdH0sXG5cblx0aXNQbGFpbk9iamVjdDogZnVuY3Rpb24oIG9iaiApIHtcblx0XHQvLyBNdXN0IGJlIGFuIE9iamVjdC5cblx0XHQvLyBCZWNhdXNlIG9mIElFLCB3ZSBhbHNvIGhhdmUgdG8gY2hlY2sgdGhlIHByZXNlbmNlIG9mIHRoZVxuICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHByb3BlcnR5LlxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IERPTSBub2RlcyBhbmQgd2luZG93IG9iamVjdHMgZG9uJ3QgcGFzc1xuICAgICAgICAgICAgICAgIC8vIHRocm91Z2gsIGFzIHdlbGxcblx0XHRpZiAoICFvYmogfHwgdG9TdHJpbmcuY2FsbChvYmopICE9PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8IG9iai5ub2RlVHlwZSB8fCBvYmouc2V0SW50ZXJ2YWwgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0XHRpZiAoIG9iai5jb25zdHJ1Y3RvclxuXHRcdFx0JiYgIWhhc093blByb3BlcnR5LmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpXG5cdFx0XHQmJiAhaGFzT3duUHJvcGVydHkuY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHRcdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHRcblx0XHR2YXIga2V5O1xuXHRcdGZvciAoIGtleSBpbiBvYmogKSB7fVxuXHRcdFxuXHRcdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmosIGtleSApO1xuXHR9LFxuXG5cdGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0Zm9yICggdmFyIG5hbWUgaW4gb2JqICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblx0XG5cdGVycm9yOiBmdW5jdGlvbiggbXNnICkge1xuXHRcdHRocm93IG1zZztcblx0fSxcblx0XG5cdHBhcnNlSlNPTjogZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0aWYgKCB0eXBlb2YgZGF0YSAhPT0gXCJzdHJpbmdcIiB8fCAhZGF0YSApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2UgaXMgcmVtb3ZlZCAoSUUgY2FuJ3RcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgaXQpXG5cdFx0ZGF0YSA9IGpRdWVyeS50cmltKCBkYXRhICk7XG5cdFx0XG5cdFx0Ly8gTWFrZSBzdXJlIHRoZSBpbmNvbWluZyBkYXRhIGlzIGFjdHVhbCBKU09OXG5cdFx0Ly8gTG9naWMgYm9ycm93ZWQgZnJvbSBodHRwOi8vanNvbi5vcmcvanNvbjIuanNcblx0XHRpZiAoIC9eW1xcXSw6e31cXHNdKiQvLnRlc3QoZGF0YS5yZXBsYWNlKC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csIFwiQFwiKVxuXHRcdFx0LnJlcGxhY2UoL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLCBcIl1cIilcblx0XHRcdC5yZXBsYWNlKC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZywgXCJcIikpICkge1xuXG5cdFx0XHQvLyBUcnkgdG8gdXNlIHRoZSBuYXRpdmUgSlNPTiBwYXJzZXIgZmlyc3Rcblx0XHRcdHJldHVybiB3aW5kb3cuSlNPTiAmJiB3aW5kb3cuSlNPTi5wYXJzZSA/XG5cdFx0XHRcdHdpbmRvdy5KU09OLnBhcnNlKCBkYXRhICkgOlxuXHRcdFx0XHQobmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgZGF0YSkpKCk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0alF1ZXJ5LmVycm9yKCBcIkludmFsaWQgSlNPTjogXCIgKyBkYXRhICk7XG5cdFx0fVxuXHR9LFxuXG5cdG5vb3A6IGZ1bmN0aW9uKCkge30sXG5cblx0Ly8gRXZhbHVsYXRlcyBhIHNjcmlwdCBpbiBhIGdsb2JhbCBjb250ZXh0XG5cdGdsb2JhbEV2YWw6IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdGlmICggZGF0YSAmJiBybm90d2hpdGUudGVzdChkYXRhKSApIHtcblx0XHRcdC8vIEluc3BpcmVkIGJ5IGNvZGUgYnkgQW5kcmVhIEdpYW1tYXJjaGlcblx0XHRcdC8vIGh0dHA6Ly93ZWJyZWZsZWN0aW9uLmJsb2dzcG90LmNvbS8yMDA3LzA4L2dsb2JhbC1zY29wZS1ldmFsdWF0aW9uLWFuZC1kb20uaHRtbFxuXHRcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0gfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuXG5cdFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG5cblx0XHRcdGlmICggalF1ZXJ5LnN1cHBvcnQuc2NyaXB0RXZhbCApIHtcblx0XHRcdFx0c2NyaXB0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggZGF0YSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzY3JpcHQudGV4dCA9IGRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiBhcHBlbmRDaGlsZCB0byBjaXJjdW12ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbiBJRTYgYnVnLlxuXHRcdFx0Ly8gVGhpcyBhcmlzZXMgd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkICgjMjcwOSkuXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZSggc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQgKTtcblx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoIHNjcmlwdCApO1xuXHRcdH1cblx0fSxcblxuXHRub2RlTmFtZTogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSBuYW1lLnRvVXBwZXJDYXNlKCk7XG5cdH0sXG5cblx0Ly8gYXJncyBpcyBmb3IgaW50ZXJuYWwgdXNhZ2Ugb25seVxuXHRlYWNoOiBmdW5jdGlvbiggb2JqZWN0LCBjYWxsYmFjaywgYXJncyApIHtcblx0XHR2YXIgbmFtZSwgaSA9IDAsXG5cdFx0XHRsZW5ndGggPSBvYmplY3QubGVuZ3RoLFxuXHRcdFx0aXNPYmogPSBsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBqUXVlcnkuaXNGdW5jdGlvbihvYmplY3QpO1xuXG5cdFx0aWYgKCBhcmdzICkge1xuXHRcdFx0aWYgKCBpc09iaiApIHtcblx0XHRcdFx0Zm9yICggbmFtZSBpbiBvYmplY3QgKSB7XG5cdFx0XHRcdFx0aWYgKCBjYWxsYmFjay5hcHBseSggb2JqZWN0WyBuYW1lIF0sIGFyZ3MgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0aWYgKCBjYWxsYmFjay5hcHBseSggb2JqZWN0WyBpKysgXSwgYXJncyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly8gQSBzcGVjaWFsLCBmYXN0LCBjYXNlIGZvciB0aGUgbW9zdCBjb21tb24gdXNlIG9mIGVhY2hcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCBpc09iaiApIHtcblx0XHRcdFx0Zm9yICggbmFtZSBpbiBvYmplY3QgKSB7XG5cdFx0XHRcdFx0aWYgKCBjYWxsYmFjay5jYWxsKCBvYmplY3RbIG5hbWUgXSwgbmFtZSwgb2JqZWN0WyBuYW1lIF0gKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoIHZhciB2YWx1ZSA9IG9iamVjdFswXTtcblx0XHRcdFx0XHRpIDwgbGVuZ3RoICYmIGNhbGxiYWNrLmNhbGwoIHZhbHVlLCBpLCB2YWx1ZSApICE9PSBmYWxzZTsgdmFsdWUgPSBvYmplY3RbKytpXSApIHt9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fSxcblxuXHR0cmltOiBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRyZXR1cm4gKHRleHQgfHwgXCJcIikucmVwbGFjZSggcnRyaW0sIFwiXCIgKTtcblx0fSxcblxuXHQvLyByZXN1bHRzIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1ha2VBcnJheTogZnVuY3Rpb24oIGFycmF5LCByZXN1bHRzICkge1xuXHRcdHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG5cdFx0aWYgKCBhcnJheSAhPSBudWxsICkge1xuXHRcdFx0Ly8gVGhlIHdpbmRvdywgc3RyaW5ncyAoYW5kIGZ1bmN0aW9ucykgYWxzbyBoYXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAnbGVuZ3RoJ1xuXHRcdFx0Ly8gVGhlIGV4dHJhIHR5cGVvZiBmdW5jdGlvbiBjaGVjayBpcyB0byBwcmV2ZW50IGNyYXNoZXNcblx0XHRcdC8vIGluIFNhZmFyaSAyIChTZWU6ICMzMDM5KVxuXHRcdFx0aWYgKCBhcnJheS5sZW5ndGggPT0gbnVsbCB8fCB0eXBlb2YgYXJyYXkgPT09IFwic3RyaW5nXCIgfHwgalF1ZXJ5LmlzRnVuY3Rpb24oYXJyYXkpIHx8ICh0eXBlb2YgYXJyYXkgIT09IFwiZnVuY3Rpb25cIiAmJiBhcnJheS5zZXRJbnRlcnZhbCkgKSB7XG5cdFx0XHRcdHB1c2guY2FsbCggcmV0LCBhcnJheSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCByZXQsIGFycmF5ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRpbkFycmF5OiBmdW5jdGlvbiggZWxlbSwgYXJyYXkgKSB7XG5cdFx0aWYgKCBhcnJheS5pbmRleE9mICkge1xuXHRcdFx0cmV0dXJuIGFycmF5LmluZGV4T2YoIGVsZW0gKTtcblx0XHR9XG5cblx0XHRmb3IgKCB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0aWYgKCBhcnJheVsgaSBdID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH0sXG5cblx0bWVyZ2U6IGZ1bmN0aW9uKCBmaXJzdCwgc2Vjb25kICkge1xuXHRcdHZhciBpID0gZmlyc3QubGVuZ3RoLCBqID0gMDtcblxuXHRcdGlmICggdHlwZW9mIHNlY29uZC5sZW5ndGggPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRmb3IgKCB2YXIgbCA9IHNlY29uZC5sZW5ndGg7IGogPCBsOyBqKysgKSB7XG5cdFx0XHRcdGZpcnN0WyBpKysgXSA9IHNlY29uZFsgaiBdO1xuXHRcdFx0fVxuXHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aGlsZSAoIHNlY29uZFtqXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRmaXJzdFsgaSsrIF0gPSBzZWNvbmRbIGorKyBdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZpcnN0Lmxlbmd0aCA9IGk7XG5cblx0XHRyZXR1cm4gZmlyc3Q7XG5cdH0sXG5cblx0Z3JlcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgaW52ICkge1xuXHRcdHZhciByZXQgPSBbXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggdGhlIGFycmF5LCBvbmx5IHNhdmluZyB0aGUgaXRlbXNcblx0XHQvLyB0aGF0IHBhc3MgdGhlIHZhbGlkYXRvciBmdW5jdGlvblxuXHRcdGZvciAoIHZhciBpID0gMCwgbGVuZ3RoID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRpZiAoICFpbnYgIT09ICFjYWxsYmFjayggZWxlbXNbIGkgXSwgaSApICkge1xuXHRcdFx0XHRyZXQucHVzaCggZWxlbXNbIGkgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Ly8gYXJnIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1hcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgYXJnICkge1xuXHRcdHZhciByZXQgPSBbXSwgdmFsdWU7XG5cblx0XHQvLyBHbyB0aHJvdWdoIHRoZSBhcnJheSwgdHJhbnNsYXRpbmcgZWFjaCBvZiB0aGUgaXRlbXMgdG8gdGhlaXJcblx0XHQvLyBuZXcgdmFsdWUgKG9yIHZhbHVlcykuXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBsZW5ndGggPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdHZhbHVlID0gY2FsbGJhY2soIGVsZW1zWyBpIF0sIGksIGFyZyApO1xuXG5cdFx0XHRpZiAoIHZhbHVlICE9IG51bGwgKSB7XG5cdFx0XHRcdHJldFsgcmV0Lmxlbmd0aCBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldC5jb25jYXQuYXBwbHkoIFtdLCByZXQgKTtcblx0fSxcblxuXHQvLyBBIGdsb2JhbCBHVUlEIGNvdW50ZXIgZm9yIG9iamVjdHNcblx0Z3VpZDogMSxcblxuXHRwcm94eTogZnVuY3Rpb24oIGZuLCBwcm94eSwgdGhpc09iamVjdCApIHtcblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDIgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBwcm94eSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0dGhpc09iamVjdCA9IGZuO1xuXHRcdFx0XHRmbiA9IHRoaXNPYmplY3RbIHByb3h5IF07XG5cdFx0XHRcdHByb3h5ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBwcm94eSAmJiAhalF1ZXJ5LmlzRnVuY3Rpb24oIHByb3h5ICkgKSB7XG5cdFx0XHRcdHRoaXNPYmplY3QgPSBwcm94eTtcblx0XHRcdFx0cHJveHkgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhcHJveHkgJiYgZm4gKSB7XG5cdFx0XHRwcm94eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkoIHRoaXNPYmplY3QgfHwgdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgZ3VpZCBvZiB1bmlxdWUgaGFuZGxlciB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbFxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZXIsIHNvIGl0IGNhbiBiZSByZW1vdmVkXG5cdFx0aWYgKCBmbiApIHtcblx0XHRcdHByb3h5Lmd1aWQgPSBmbi5ndWlkID0gZm4uZ3VpZCB8fCBwcm94eS5ndWlkIHx8IGpRdWVyeS5ndWlkKys7XG5cdFx0fVxuXG5cdFx0Ly8gU28gcHJveHkgY2FuIGJlIGRlY2xhcmVkIGFzIGFuIGFyZ3VtZW50XG5cdFx0cmV0dXJuIHByb3h5O1xuXHR9LFxuXG5cdC8vIFVzZSBvZiBqUXVlcnkuYnJvd3NlciBpcyBmcm93bmVkIHVwb24uXG5cdC8vIE1vcmUgZGV0YWlsczogaHR0cDovL2RvY3MuanF1ZXJ5LmNvbS9VdGlsaXRpZXMvalF1ZXJ5LmJyb3dzZXJcblx0dWFNYXRjaDogZnVuY3Rpb24oIHVhICkge1xuXHRcdHVhID0gdWEudG9Mb3dlckNhc2UoKTtcblxuXHRcdHZhciBtYXRjaCA9IC8od2Via2l0KVsgXFwvXShbXFx3Ll0rKS8uZXhlYyggdWEgKSB8fFxuXHRcdFx0LyhvcGVyYSkoPzouKnZlcnNpb24pP1sgXFwvXShbXFx3Ll0rKS8uZXhlYyggdWEgKSB8fFxuXHRcdFx0Lyhtc2llKSAoW1xcdy5dKykvLmV4ZWMoIHVhICkgfHxcblx0XHRcdCEvY29tcGF0aWJsZS8udGVzdCggdWEgKSAmJiAvKG1vemlsbGEpKD86Lio/IHJ2OihbXFx3Ll0rKSk/Ly5leGVjKCB1YSApIHx8XG5cdFx0ICBcdFtdO1xuXG5cdFx0cmV0dXJuIHsgYnJvd3NlcjogbWF0Y2hbMV0gfHwgXCJcIiwgdmVyc2lvbjogbWF0Y2hbMl0gfHwgXCIwXCIgfTtcblx0fSxcblxuXHRicm93c2VyOiB7fVxufSk7XG5cbmJyb3dzZXJNYXRjaCA9IGpRdWVyeS51YU1hdGNoKCB1c2VyQWdlbnQgKTtcbmlmICggYnJvd3Nlck1hdGNoLmJyb3dzZXIgKSB7XG5cdGpRdWVyeS5icm93c2VyWyBicm93c2VyTWF0Y2guYnJvd3NlciBdID0gdHJ1ZTtcblx0alF1ZXJ5LmJyb3dzZXIudmVyc2lvbiA9IGJyb3dzZXJNYXRjaC52ZXJzaW9uO1xufVxuXG4vLyBEZXByZWNhdGVkLCB1c2UgalF1ZXJ5LmJyb3dzZXIud2Via2l0IGluc3RlYWRcbmlmICggalF1ZXJ5LmJyb3dzZXIud2Via2l0ICkge1xuXHRqUXVlcnkuYnJvd3Nlci5zYWZhcmkgPSB0cnVlO1xufVxuXG5pZiAoIGluZGV4T2YgKSB7XG5cdGpRdWVyeS5pbkFycmF5ID0gZnVuY3Rpb24oIGVsZW0sIGFycmF5ICkge1xuXHRcdHJldHVybiBpbmRleE9mLmNhbGwoIGFycmF5LCBlbGVtICk7XG5cdH07XG59XG5cbi8vIEFsbCBqUXVlcnkgb2JqZWN0cyBzaG91bGQgcG9pbnQgYmFjayB0byB0aGVzZVxucm9vdGpRdWVyeSA9IGpRdWVyeShkb2N1bWVudCk7XG5cbi8vIENsZWFudXAgZnVuY3Rpb25zIGZvciB0aGUgZG9jdW1lbnQgcmVhZHkgbWV0aG9kXG5pZiAoIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdERPTUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgRE9NQ29udGVudExvYWRlZCwgZmFsc2UgKTtcblx0XHRqUXVlcnkucmVhZHkoKTtcblx0fTtcblxufSBlbHNlIGlmICggZG9jdW1lbnQuYXR0YWNoRXZlbnQgKSB7XG5cdERPTUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBNYWtlIHN1cmUgYm9keSBleGlzdHMsIGF0IGxlYXN0LCBpbiBjYXNlIElFIGdldHMgYSBsaXR0bGVcbiAgICAgICAgICAgICAgICAvLyBvdmVyemVhbG91cyAodGlja2V0ICM1NDQzKS5cblx0XHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiApIHtcblx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBET01Db250ZW50TG9hZGVkICk7XG5cdFx0XHRqUXVlcnkucmVhZHkoKTtcblx0XHR9XG5cdH07XG59XG5cbi8vIFRoZSBET00gcmVhZHkgY2hlY2sgZm9yIEludGVybmV0IEV4cGxvcmVyXG5mdW5jdGlvbiBkb1Njcm9sbENoZWNrKCkge1xuXHRpZiAoIGpRdWVyeS5pc1JlYWR5ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRyeSB7XG5cdFx0Ly8gSWYgSUUgaXMgdXNlZCwgdXNlIHRoZSB0cmljayBieSBEaWVnbyBQZXJpbmlcblx0XHQvLyBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vSUVDb250ZW50TG9hZGVkL1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbChcImxlZnRcIik7XG5cdH0gY2F0Y2goIGVycm9yICkge1xuXHRcdHNldFRpbWVvdXQoIGRvU2Nyb2xsQ2hlY2ssIDEgKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBhbmQgZXhlY3V0ZSBhbnkgd2FpdGluZyBmdW5jdGlvbnNcblx0alF1ZXJ5LnJlYWR5KCk7XG59XG5cbmZ1bmN0aW9uIGV2YWxTY3JpcHQoIGksIGVsZW0gKSB7XG5cdGlmICggZWxlbS5zcmMgKSB7XG5cdFx0alF1ZXJ5LmFqYXgoe1xuXHRcdFx0dXJsOiBlbGVtLnNyYyxcblx0XHRcdGFzeW5jOiBmYWxzZSxcblx0XHRcdGRhdGFUeXBlOiBcInNjcmlwdFwiXG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIGVsZW0udGV4dCB8fCBlbGVtLnRleHRDb250ZW50IHx8IGVsZW0uaW5uZXJIVE1MIHx8IFwiXCIgKTtcblx0fVxuXG5cdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWxlbSApO1xuXHR9XG59XG5cbi8vIE11dGlmdW5jdGlvbmFsIG1ldGhvZCB0byBnZXQgYW5kIHNldCB2YWx1ZXMgdG8gYSBjb2xsZWN0aW9uXG4vLyBUaGUgdmFsdWUvcyBjYW4gYmUgb3B0aW9uYWxseSBieSBleGVjdXRlZCBpZiBpdHMgYSBmdW5jdGlvblxuZnVuY3Rpb24gYWNjZXNzKCBlbGVtcywga2V5LCB2YWx1ZSwgZXhlYywgZm4sIHBhc3MgKSB7XG5cdHZhciBsZW5ndGggPSBlbGVtcy5sZW5ndGg7XG5cdFxuXHQvLyBTZXR0aW5nIG1hbnkgYXR0cmlidXRlc1xuXHRpZiAoIHR5cGVvZiBrZXkgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0Zm9yICggdmFyIGsgaW4ga2V5ICkge1xuXHRcdFx0YWNjZXNzKCBlbGVtcywgaywga2V5W2tdLCBleGVjLCBmbiwgdmFsdWUgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsZW1zO1xuXHR9XG5cdFxuXHQvLyBTZXR0aW5nIG9uZSBhdHRyaWJ1dGVcblx0aWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdC8vIE9wdGlvbmFsbHksIGZ1bmN0aW9uIHZhbHVlcyBnZXQgZXhlY3V0ZWQgaWYgZXhlYyBpcyB0cnVlXG5cdFx0ZXhlYyA9ICFwYXNzICYmIGV4ZWMgJiYgalF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpO1xuXHRcdFxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0Zm4oIGVsZW1zW2ldLCBrZXksIGV4ZWMgPyB2YWx1ZS5jYWxsKCBlbGVtc1tpXSwgaSwgZm4oIGVsZW1zW2ldLCBrZXkgKSApIDogdmFsdWUsIHBhc3MgKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIGVsZW1zO1xuXHR9XG5cdFxuXHQvLyBHZXR0aW5nIGFuIGF0dHJpYnV0ZVxuXHRyZXR1cm4gbGVuZ3RoID8gZm4oIGVsZW1zWzBdLCBrZXkgKSA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuXHRyZXR1cm4gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG59XG4oZnVuY3Rpb24oKSB7XG5cblx0alF1ZXJ5LnN1cHBvcnQgPSB7fTtcblxuXHR2YXIgcm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0aWQgPSBcInNjcmlwdFwiICsgbm93KCk7XG5cblx0ZGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0ZGl2LmlubmVySFRNTCA9IFwiICAgPGxpbmsvPjx0YWJsZT48L3RhYmxlPjxhIGhyZWY9Jy9hJyBzdHlsZT0nY29sb3I6cmVkO2Zsb2F0OmxlZnQ7b3BhY2l0eTouNTU7Jz5hPC9hPjxpbnB1dCB0eXBlPSdjaGVja2JveCcvPlwiO1xuXG5cdHZhciBhbGwgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLFxuXHRcdGEgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuXG5cdC8vIENhbid0IGdldCBiYXNpYyB0ZXN0IHN1cHBvcnRcblx0aWYgKCAhYWxsIHx8ICFhbGwubGVuZ3RoIHx8ICFhICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeS5zdXBwb3J0ID0ge1xuXHRcdC8vIElFIHN0cmlwcyBsZWFkaW5nIHdoaXRlc3BhY2Ugd2hlbiAuaW5uZXJIVE1MIGlzIHVzZWRcblx0XHRsZWFkaW5nV2hpdGVzcGFjZTogZGl2LmZpcnN0Q2hpbGQubm9kZVR5cGUgPT09IDMsXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0Ym9keSBlbGVtZW50cyBhcmVuJ3QgYXV0b21hdGljYWxseSBpbnNlcnRlZFxuXHRcdC8vIElFIHdpbGwgaW5zZXJ0IHRoZW0gaW50byBlbXB0eSB0YWJsZXNcblx0XHR0Ym9keTogIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpLmxlbmd0aCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGxpbmsgZWxlbWVudHMgZ2V0IHNlcmlhbGl6ZWQgY29ycmVjdGx5IGJ5XG4gICAgICAgICAgICAgICAgLy8gaW5uZXJIVE1MXG5cdFx0Ly8gVGhpcyByZXF1aXJlcyBhIHdyYXBwZXIgZWxlbWVudCBpbiBJRVxuXHRcdGh0bWxTZXJpYWxpemU6ICEhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiKS5sZW5ndGgsXG5cblx0XHQvLyBHZXQgdGhlIHN0eWxlIGluZm9ybWF0aW9uIGZyb20gZ2V0QXR0cmlidXRlXG5cdFx0Ly8gKElFIHVzZXMgLmNzc1RleHQgaW5zdGVkKVxuXHRcdHN0eWxlOiAvcmVkLy50ZXN0KCBhLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBVUkxzIGFyZW4ndCBtYW5pcHVsYXRlZFxuXHRcdC8vIChJRSBub3JtYWxpemVzIGl0IGJ5IGRlZmF1bHQpXG5cdFx0aHJlZk5vcm1hbGl6ZWQ6IGEuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIvYVwiLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgZWxlbWVudCBvcGFjaXR5IGV4aXN0c1xuXHRcdC8vIChJRSB1c2VzIGZpbHRlciBpbnN0ZWFkKVxuXHRcdC8vIFVzZSBhIHJlZ2V4IHRvIHdvcmsgYXJvdW5kIGEgV2ViS2l0IGlzc3VlLiBTZWUgIzUxNDVcblx0XHRvcGFjaXR5OiAvXjAuNTUkLy50ZXN0KCBhLnN0eWxlLm9wYWNpdHkgKSxcblxuXHRcdC8vIFZlcmlmeSBzdHlsZSBmbG9hdCBleGlzdGVuY2Vcblx0XHQvLyAoSUUgdXNlcyBzdHlsZUZsb2F0IGluc3RlYWQgb2YgY3NzRmxvYXQpXG5cdFx0Y3NzRmxvYXQ6ICEhYS5zdHlsZS5jc3NGbG9hdCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCBmb3IgYSBjaGVja2JveFxuXHRcdC8vIHRoYXQgaXQgZGVmYXVsdHMgdG8gXCJvblwiLlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gXCJcIiBpbnN0ZWFkKVxuXHRcdGNoZWNrT246IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnZhbHVlID09PSBcIm9uXCIsXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBhIHNlbGVjdGVkLWJ5LWRlZmF1bHQgb3B0aW9uIGhhcyBhIHdvcmtpbmdcbiAgICAgICAgICAgICAgICAvLyBzZWxlY3RlZCBwcm9wZXJ0eS5cblx0XHQvLyAoV2ViS2l0IGRlZmF1bHRzIHRvIGZhbHNlIGluc3RlYWQgb2YgdHJ1ZSwgSUUgdG9vLCBpZiBpdCdzIGluXG4gICAgICAgICAgICAgICAgLy8gYW4gb3B0Z3JvdXApXG5cdFx0b3B0U2VsZWN0ZWQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIikuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikgKS5zZWxlY3RlZCxcblxuXHRcdHBhcmVudE5vZGU6IGRpdi5yZW1vdmVDaGlsZCggZGl2LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpICkgKS5wYXJlbnROb2RlID09PSBudWxsLFxuXG5cdFx0Ly8gV2lsbCBiZSBkZWZpbmVkIGxhdGVyXG5cdFx0ZGVsZXRlRXhwYW5kbzogdHJ1ZSxcblx0XHRjaGVja0Nsb25lOiBmYWxzZSxcblx0XHRzY3JpcHRFdmFsOiBmYWxzZSxcblx0XHRub0Nsb25lRXZlbnQ6IHRydWUsXG5cdFx0Ym94TW9kZWw6IG51bGxcblx0fTtcblxuXHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG5cdHRyeSB7XG5cdFx0c2NyaXB0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggXCJ3aW5kb3cuXCIgKyBpZCArIFwiPTE7XCIgKSApO1xuXHR9IGNhdGNoKGUpIHt9XG5cblx0cm9vdC5pbnNlcnRCZWZvcmUoIHNjcmlwdCwgcm9vdC5maXJzdENoaWxkICk7XG5cblx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIGV4ZWN1dGlvbiBvZiBjb2RlIHdvcmtzIGJ5IGluamVjdGluZyBhIHNjcmlwdFxuXHQvLyB0YWcgd2l0aCBhcHBlbmRDaGlsZC9jcmVhdGVUZXh0Tm9kZVxuXHQvLyAoSUUgZG9lc24ndCBzdXBwb3J0IHRoaXMsIGZhaWxzLCBhbmQgdXNlcyAudGV4dCBpbnN0ZWFkKVxuXHRpZiAoIHdpbmRvd1sgaWQgXSApIHtcblx0XHRqUXVlcnkuc3VwcG9ydC5zY3JpcHRFdmFsID0gdHJ1ZTtcblx0XHRkZWxldGUgd2luZG93WyBpZCBdO1xuXHR9XG5cblx0Ly8gVGVzdCB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkZWxldGUgYW4gZXhwYW5kbyBmcm9tIGFuIGVsZW1lbnRcblx0Ly8gRmFpbHMgaW4gSW50ZXJuZXQgRXhwbG9yZXJcblx0dHJ5IHtcblx0XHRkZWxldGUgc2NyaXB0LnRlc3Q7XG5cdFxuXHR9IGNhdGNoKGUpIHtcblx0XHRqUXVlcnkuc3VwcG9ydC5kZWxldGVFeHBhbmRvID0gZmFsc2U7XG5cdH1cblxuXHRyb290LnJlbW92ZUNoaWxkKCBzY3JpcHQgKTtcblxuXHRpZiAoIGRpdi5hdHRhY2hFdmVudCAmJiBkaXYuZmlyZUV2ZW50ICkge1xuXHRcdGRpdi5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgZnVuY3Rpb24gY2xpY2soKSB7XG5cdFx0XHQvLyBDbG9uaW5nIGEgbm9kZSBzaG91bGRuJ3QgY29weSBvdmVyIGFueVxuXHRcdFx0Ly8gYm91bmQgZXZlbnQgaGFuZGxlcnMgKElFIGRvZXMgdGhpcylcblx0XHRcdGpRdWVyeS5zdXBwb3J0Lm5vQ2xvbmVFdmVudCA9IGZhbHNlO1xuXHRcdFx0ZGl2LmRldGFjaEV2ZW50KFwib25jbGlja1wiLCBjbGljayk7XG5cdFx0fSk7XG5cdFx0ZGl2LmNsb25lTm9kZSh0cnVlKS5maXJlRXZlbnQoXCJvbmNsaWNrXCIpO1xuXHR9XG5cblx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ZGl2LmlubmVySFRNTCA9IFwiPGlucHV0IHR5cGU9J3JhZGlvJyBuYW1lPSdyYWRpb3Rlc3QnIGNoZWNrZWQ9J2NoZWNrZWQnLz5cIjtcblxuXHR2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYuZmlyc3RDaGlsZCApO1xuXG5cdC8vIFdlYktpdCBkb2Vzbid0IGNsb25lIGNoZWNrZWQgc3RhdGUgY29ycmVjdGx5IGluIGZyYWdtZW50c1xuXHRqUXVlcnkuc3VwcG9ydC5jaGVja0Nsb25lID0gZnJhZ21lbnQuY2xvbmVOb2RlKHRydWUpLmNsb25lTm9kZSh0cnVlKS5sYXN0Q2hpbGQuY2hlY2tlZDtcblxuXHQvLyBGaWd1cmUgb3V0IGlmIHRoZSBXM0MgYm94IG1vZGVsIHdvcmtzIGFzIGV4cGVjdGVkXG5cdC8vIGRvY3VtZW50LmJvZHkgbXVzdCBleGlzdCBiZWZvcmUgd2UgY2FuIGRvIHRoaXNcblx0alF1ZXJ5KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGRpdi5zdHlsZS53aWR0aCA9IGRpdi5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMXB4XCI7XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHRqUXVlcnkuYm94TW9kZWwgPSBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbCA9IGRpdi5vZmZzZXRXaWR0aCA9PT0gMjtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBkaXYgKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0ZGl2ID0gbnVsbDtcblx0fSk7XG5cblx0Ly8gVGVjaG5pcXVlIGZyb20gSnVyaXkgWmF5dHNldlxuXHQvLyBodHRwOi8vdGhpbmt3ZWIyLmNvbS9wcm9qZWN0cy9wcm90b3R5cGUvZGV0ZWN0aW5nLWV2ZW50LXN1cHBvcnQtd2l0aG91dC1icm93c2VyLXNuaWZmaW5nL1xuXHR2YXIgZXZlbnRTdXBwb3J0ZWQgPSBmdW5jdGlvbiggZXZlbnROYW1lICkgeyBcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyBcblx0XHRldmVudE5hbWUgPSBcIm9uXCIgKyBldmVudE5hbWU7IFxuXG5cdFx0dmFyIGlzU3VwcG9ydGVkID0gKGV2ZW50TmFtZSBpbiBlbCk7IFxuXHRcdGlmICggIWlzU3VwcG9ydGVkICkgeyBcblx0XHRcdGVsLnNldEF0dHJpYnV0ZShldmVudE5hbWUsIFwicmV0dXJuO1wiKTsgXG5cdFx0XHRpc1N1cHBvcnRlZCA9IHR5cGVvZiBlbFtldmVudE5hbWVdID09PSBcImZ1bmN0aW9uXCI7IFxuXHRcdH0gXG5cdFx0ZWwgPSBudWxsOyBcblxuXHRcdHJldHVybiBpc1N1cHBvcnRlZDsgXG5cdH07XG5cdFxuXHRqUXVlcnkuc3VwcG9ydC5zdWJtaXRCdWJibGVzID0gZXZlbnRTdXBwb3J0ZWQoXCJzdWJtaXRcIik7XG5cdGpRdWVyeS5zdXBwb3J0LmNoYW5nZUJ1YmJsZXMgPSBldmVudFN1cHBvcnRlZChcImNoYW5nZVwiKTtcblxuXHQvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHRyb290ID0gc2NyaXB0ID0gZGl2ID0gYWxsID0gYSA9IG51bGw7XG59KSgpO1xuXG5qUXVlcnkucHJvcHMgPSB7XG5cdFwiZm9yXCI6IFwiaHRtbEZvclwiLFxuXHRcImNsYXNzXCI6IFwiY2xhc3NOYW1lXCIsXG5cdHJlYWRvbmx5OiBcInJlYWRPbmx5XCIsXG5cdG1heGxlbmd0aDogXCJtYXhMZW5ndGhcIixcblx0Y2VsbHNwYWNpbmc6IFwiY2VsbFNwYWNpbmdcIixcblx0cm93c3BhbjogXCJyb3dTcGFuXCIsXG5cdGNvbHNwYW46IFwiY29sU3BhblwiLFxuXHR0YWJpbmRleDogXCJ0YWJJbmRleFwiLFxuXHR1c2VtYXA6IFwidXNlTWFwXCIsXG5cdGZyYW1lYm9yZGVyOiBcImZyYW1lQm9yZGVyXCJcbn07XG52YXIgZXhwYW5kbyA9IFwialF1ZXJ5XCIgKyBub3coKSwgdXVpZCA9IDAsIHdpbmRvd0RhdGEgPSB7fTtcblxualF1ZXJ5LmV4dGVuZCh7XG5cdGNhY2hlOiB7fSxcblx0XG5cdGV4cGFuZG86ZXhwYW5kbyxcblxuXHQvLyBUaGUgZm9sbG93aW5nIGVsZW1lbnRzIHRocm93IHVuY2F0Y2hhYmxlIGV4Y2VwdGlvbnMgaWYgeW91XG5cdC8vIGF0dGVtcHQgdG8gYWRkIGV4cGFuZG8gcHJvcGVydGllcyB0byB0aGVtLlxuXHRub0RhdGE6IHtcblx0XHRcImVtYmVkXCI6IHRydWUsXG5cdFx0XCJvYmplY3RcIjogdHJ1ZSxcblx0XHRcImFwcGxldFwiOiB0cnVlXG5cdH0sXG5cblx0ZGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGRhdGEgKSB7XG5cdFx0aWYgKCBlbGVtLm5vZGVOYW1lICYmIGpRdWVyeS5ub0RhdGFbZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRlbGVtID0gZWxlbSA9PSB3aW5kb3cgP1xuXHRcdFx0d2luZG93RGF0YSA6XG5cdFx0XHRlbGVtO1xuXG5cdFx0dmFyIGlkID0gZWxlbVsgZXhwYW5kbyBdLCBjYWNoZSA9IGpRdWVyeS5jYWNoZSwgdGhpc0NhY2hlO1xuXG5cdFx0aWYgKCAhaWQgJiYgdHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIgJiYgZGF0YSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gQ29tcHV0ZSBhIHVuaXF1ZSBJRCBmb3IgdGhlIGVsZW1lbnRcblx0XHRpZiAoICFpZCApIHsgXG5cdFx0XHRpZCA9ICsrdXVpZDtcblx0XHR9XG5cblx0XHQvLyBBdm9pZCBnZW5lcmF0aW5nIGEgbmV3IGNhY2hlIHVubGVzcyBub25lIGV4aXN0cyBhbmQgd2Vcblx0XHQvLyB3YW50IHRvIG1hbmlwdWxhdGUgaXQuXG5cdFx0aWYgKCB0eXBlb2YgbmFtZSA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdGVsZW1bIGV4cGFuZG8gXSA9IGlkO1xuXHRcdFx0dGhpc0NhY2hlID0gY2FjaGVbIGlkIF0gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBuYW1lKTtcblxuXHRcdH0gZWxzZSBpZiAoICFjYWNoZVsgaWQgXSApIHtcblx0XHRcdGVsZW1bIGV4cGFuZG8gXSA9IGlkO1xuXHRcdFx0Y2FjaGVbIGlkIF0gPSB7fTtcblx0XHR9XG5cblx0XHR0aGlzQ2FjaGUgPSBjYWNoZVsgaWQgXTtcblxuXHRcdC8vIFByZXZlbnQgb3ZlcnJpZGluZyB0aGUgbmFtZWQgY2FjaGUgd2l0aCB1bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzQ2FjaGVbIG5hbWUgXSA9IGRhdGE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiID8gdGhpc0NhY2hlWyBuYW1lIF0gOiB0aGlzQ2FjaGU7XG5cdH0sXG5cblx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0aWYgKCBlbGVtLm5vZGVOYW1lICYmIGpRdWVyeS5ub0RhdGFbZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRlbGVtID0gZWxlbSA9PSB3aW5kb3cgP1xuXHRcdFx0d2luZG93RGF0YSA6XG5cdFx0XHRlbGVtO1xuXG5cdFx0dmFyIGlkID0gZWxlbVsgZXhwYW5kbyBdLCBjYWNoZSA9IGpRdWVyeS5jYWNoZSwgdGhpc0NhY2hlID0gY2FjaGVbIGlkIF07XG5cblx0XHQvLyBJZiB3ZSB3YW50IHRvIHJlbW92ZSBhIHNwZWNpZmljIHNlY3Rpb24gb2YgdGhlIGVsZW1lbnQncyBkYXRhXG5cdFx0aWYgKCBuYW1lICkge1xuXHRcdFx0aWYgKCB0aGlzQ2FjaGUgKSB7XG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgc2VjdGlvbiBvZiBjYWNoZSBkYXRhXG5cdFx0XHRcdGRlbGV0ZSB0aGlzQ2FjaGVbIG5hbWUgXTtcblxuXHRcdFx0XHQvLyBJZiB3ZSd2ZSByZW1vdmVkIGFsbCB0aGUgZGF0YSwgcmVtb3ZlIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50J3MgY2FjaGVcblx0XHRcdFx0aWYgKCBqUXVlcnkuaXNFbXB0eU9iamVjdCh0aGlzQ2FjaGUpICkge1xuXHRcdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKCBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSwgd2Ugd2FudCB0byByZW1vdmUgYWxsIG9mIHRoZSBlbGVtZW50J3MgZGF0YVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIGpRdWVyeS5zdXBwb3J0LmRlbGV0ZUV4cGFuZG8gKSB7XG5cdFx0XHRcdGRlbGV0ZSBlbGVtWyBqUXVlcnkuZXhwYW5kbyBdO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBlbGVtLnJlbW92ZUF0dHJpYnV0ZSApIHtcblx0XHRcdFx0ZWxlbS5yZW1vdmVBdHRyaWJ1dGUoIGpRdWVyeS5leHBhbmRvICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbXBsZXRlbHkgcmVtb3ZlIHRoZSBkYXRhIGNhY2hlXG5cdFx0XHRkZWxldGUgY2FjaGVbIGlkIF07XG5cdFx0fVxuXHR9XG59KTtcblxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cdGRhdGE6IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdGlmICggdHlwZW9mIGtleSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZGF0YSggdGhpc1swXSApO1xuXG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeS5kYXRhKCB0aGlzLCBrZXkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIi5cIik7XG5cdFx0cGFydHNbMV0gPSBwYXJ0c1sxXSA/IFwiLlwiICsgcGFydHNbMV0gOiBcIlwiO1xuXG5cdFx0aWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLnRyaWdnZXJIYW5kbGVyKFwiZ2V0RGF0YVwiICsgcGFydHNbMV0gKyBcIiFcIiwgW3BhcnRzWzBdXSk7XG5cblx0XHRcdGlmICggZGF0YSA9PT0gdW5kZWZpbmVkICYmIHRoaXMubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhID0galF1ZXJ5LmRhdGEoIHRoaXNbMF0sIGtleSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRhdGEgPT09IHVuZGVmaW5lZCAmJiBwYXJ0c1sxXSA/XG5cdFx0XHRcdHRoaXMuZGF0YSggcGFydHNbMF0gKSA6XG5cdFx0XHRcdGRhdGE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLnRyaWdnZXIoXCJzZXREYXRhXCIgKyBwYXJ0c1sxXSArIFwiIVwiLCBbcGFydHNbMF0sIHZhbHVlXSkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5LmRhdGEoIHRoaXMsIGtleSwgdmFsdWUgKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbigga2V5ICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggdGhpcywga2V5ICk7XG5cdFx0fSk7XG5cdH1cbn0pO1xualF1ZXJ5LmV4dGVuZCh7XG5cdHF1ZXVlOiBmdW5jdGlvbiggZWxlbSwgdHlwZSwgZGF0YSApIHtcblx0XHRpZiAoICFlbGVtICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHR5cGUgPSAodHlwZSB8fCBcImZ4XCIpICsgXCJxdWV1ZVwiO1xuXHRcdHZhciBxID0galF1ZXJ5LmRhdGEoIGVsZW0sIHR5cGUgKTtcblxuXHRcdC8vIFNwZWVkIHVwIGRlcXVldWUgYnkgZ2V0dGluZyBvdXQgcXVpY2tseSBpZiB0aGlzIGlzIGp1c3QgYVxuICAgICAgICAgICAgICAgIC8vIGxvb2t1cFxuXHRcdGlmICggIWRhdGEgKSB7XG5cdFx0XHRyZXR1cm4gcSB8fCBbXTtcblx0XHR9XG5cblx0XHRpZiAoICFxIHx8IGpRdWVyeS5pc0FycmF5KGRhdGEpICkge1xuXHRcdFx0cSA9IGpRdWVyeS5kYXRhKCBlbGVtLCB0eXBlLCBqUXVlcnkubWFrZUFycmF5KGRhdGEpICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0cS5wdXNoKCBkYXRhICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHE7XG5cdH0sXG5cblx0ZGVxdWV1ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGUgKSB7XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXG5cdFx0dmFyIHF1ZXVlID0galF1ZXJ5LnF1ZXVlKCBlbGVtLCB0eXBlICksIGZuID0gcXVldWUuc2hpZnQoKTtcblxuXHRcdC8vIElmIHRoZSBmeCBxdWV1ZSBpcyBkZXF1ZXVlZCwgYWx3YXlzIHJlbW92ZSB0aGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICAvLyBzZW50aW5lbFxuXHRcdGlmICggZm4gPT09IFwiaW5wcm9ncmVzc1wiICkge1xuXHRcdFx0Zm4gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdH1cblxuXHRcdGlmICggZm4gKSB7XG5cdFx0XHQvLyBBZGQgYSBwcm9ncmVzcyBzZW50aW5lbCB0byBwcmV2ZW50IHRoZSBmeCBxdWV1ZSBmcm9tXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWluZ1xuXHRcdFx0Ly8gYXV0b21hdGljYWxseSBkZXF1ZXVlZFxuXHRcdFx0aWYgKCB0eXBlID09PSBcImZ4XCIgKSB7XG5cdFx0XHRcdHF1ZXVlLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRmbi5jYWxsKGVsZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZShlbGVtLCB0eXBlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufSk7XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRxdWV1ZTogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdHlwZSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGRhdGEgPSB0eXBlO1xuXHRcdFx0dHlwZSA9IFwiZnhcIjtcblx0XHR9XG5cblx0XHRpZiAoIGRhdGEgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiBqUXVlcnkucXVldWUoIHRoaXNbMF0sIHR5cGUgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSwgZWxlbSApIHtcblx0XHRcdHZhciBxdWV1ZSA9IGpRdWVyeS5xdWV1ZSggdGhpcywgdHlwZSwgZGF0YSApO1xuXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiZnhcIiAmJiBxdWV1ZVswXSAhPT0gXCJpbnByb2dyZXNzXCIgKSB7XG5cdFx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCB0eXBlICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGRlcXVldWU6IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8vIEJhc2VkIG9mZiBvZiB0aGUgcGx1Z2luIGJ5IENsaW50IEhlbGZlcnMsIHdpdGggcGVybWlzc2lvbi5cblx0Ly8gaHR0cDovL2JsaW5kc2lnbmFscy5jb20vaW5kZXgucGhwLzIwMDkvMDcvanF1ZXJ5LWRlbGF5L1xuXHRkZWxheTogZnVuY3Rpb24oIHRpbWUsIHR5cGUgKSB7XG5cdFx0dGltZSA9IGpRdWVyeS5meCA/IGpRdWVyeS5meC5zcGVlZHNbdGltZV0gfHwgdGltZSA6IHRpbWU7XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXG5cdFx0cmV0dXJuIHRoaXMucXVldWUoIHR5cGUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW0gPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5LmRlcXVldWUoIGVsZW0sIHR5cGUgKTtcblx0XHRcdH0sIHRpbWUgKTtcblx0XHR9KTtcblx0fSxcblxuXHRjbGVhclF1ZXVlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRyZXR1cm4gdGhpcy5xdWV1ZSggdHlwZSB8fCBcImZ4XCIsIFtdICk7XG5cdH1cbn0pO1xudmFyIHJjbGFzcyA9IC9bXFxuXFx0XS9nLFxuXHRyc3BhY2UgPSAvXFxzKy8sXG5cdHJyZXR1cm4gPSAvXFxyL2csXG5cdHJzcGVjaWFsdXJsID0gL2hyZWZ8c3JjfHN0eWxlLyxcblx0cnR5cGUgPSAvKGJ1dHRvbnxpbnB1dCkvaSxcblx0cmZvY3VzYWJsZSA9IC8oYnV0dG9ufGlucHV0fG9iamVjdHxzZWxlY3R8dGV4dGFyZWEpL2ksXG5cdHJjbGlja2FibGUgPSAvXihhfGFyZWEpJC9pLFxuXHRycmFkaW9jaGVjayA9IC9yYWRpb3xjaGVja2JveC87XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRhdHRyOiBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGFjY2VzcyggdGhpcywgbmFtZSwgdmFsdWUsIHRydWUsIGpRdWVyeS5hdHRyICk7XG5cdH0sXG5cblx0cmVtb3ZlQXR0cjogZnVuY3Rpb24oIG5hbWUsIGZuICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdGpRdWVyeS5hdHRyKCB0aGlzLCBuYW1lLCBcIlwiICk7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKCBuYW1lICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0YWRkQ2xhc3M6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKHZhbHVlKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSh0aGlzKTtcblx0XHRcdFx0c2VsZi5hZGRDbGFzcyggdmFsdWUuY2FsbCh0aGlzLCBpLCBzZWxmLmF0dHIoXCJjbGFzc1wiKSkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0dmFyIGNsYXNzTmFtZXMgPSAodmFsdWUgfHwgXCJcIikuc3BsaXQoIHJzcGFjZSApO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0dmFyIGVsZW0gPSB0aGlzW2ldO1xuXG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRpZiAoICFlbGVtLmNsYXNzTmFtZSApIHtcblx0XHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gdmFsdWU7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGNsYXNzTmFtZSA9IFwiIFwiICsgZWxlbS5jbGFzc05hbWUgKyBcIiBcIiwgc2V0Q2xhc3MgPSBlbGVtLmNsYXNzTmFtZTtcblx0XHRcdFx0XHRcdGZvciAoIHZhciBjID0gMCwgY2wgPSBjbGFzc05hbWVzLmxlbmd0aDsgYyA8IGNsOyBjKysgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggY2xhc3NOYW1lLmluZGV4T2YoIFwiIFwiICsgY2xhc3NOYW1lc1tjXSArIFwiIFwiICkgPCAwICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldENsYXNzICs9IFwiIFwiICsgY2xhc3NOYW1lc1tjXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBqUXVlcnkudHJpbSggc2V0Q2xhc3MgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRyZW1vdmVDbGFzczogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdHZhciBzZWxmID0galF1ZXJ5KHRoaXMpO1xuXHRcdFx0XHRzZWxmLnJlbW92ZUNsYXNzKCB2YWx1ZS5jYWxsKHRoaXMsIGksIHNlbGYuYXR0cihcImNsYXNzXCIpKSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dmFyIGNsYXNzTmFtZXMgPSAodmFsdWUgfHwgXCJcIikuc3BsaXQocnNwYWNlKTtcblxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdHZhciBlbGVtID0gdGhpc1tpXTtcblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgZWxlbS5jbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdHZhciBjbGFzc05hbWUgPSAoXCIgXCIgKyBlbGVtLmNsYXNzTmFtZSArIFwiIFwiKS5yZXBsYWNlKHJjbGFzcywgXCIgXCIpO1xuXHRcdFx0XHRcdFx0Zm9yICggdmFyIGMgPSAwLCBjbCA9IGNsYXNzTmFtZXMubGVuZ3RoOyBjIDwgY2w7IGMrKyApIHtcblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UoXCIgXCIgKyBjbGFzc05hbWVzW2NdICsgXCIgXCIsIFwiIFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0galF1ZXJ5LnRyaW0oIGNsYXNzTmFtZSApO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gXCJcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b2dnbGVDbGFzczogZnVuY3Rpb24oIHZhbHVlLCBzdGF0ZVZhbCApIHtcblx0XHR2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZSwgaXNCb29sID0gdHlwZW9mIHN0YXRlVmFsID09PSBcImJvb2xlYW5cIjtcblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGkpIHtcblx0XHRcdFx0dmFyIHNlbGYgPSBqUXVlcnkodGhpcyk7XG5cdFx0XHRcdHNlbGYudG9nZ2xlQ2xhc3MoIHZhbHVlLmNhbGwodGhpcywgaSwgc2VsZi5hdHRyKFwiY2xhc3NcIiksIHN0YXRlVmFsKSwgc3RhdGVWYWwgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdC8vIHRvZ2dsZSBpbmRpdmlkdWFsIGNsYXNzIG5hbWVzXG5cdFx0XHRcdHZhciBjbGFzc05hbWUsIGkgPSAwLCBzZWxmID0galF1ZXJ5KHRoaXMpLFxuXHRcdFx0XHRcdHN0YXRlID0gc3RhdGVWYWwsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lcyA9IHZhbHVlLnNwbGl0KCByc3BhY2UgKTtcblxuXHRcdFx0XHR3aGlsZSAoIChjbGFzc05hbWUgPSBjbGFzc05hbWVzWyBpKysgXSkgKSB7XG5cdFx0XHRcdFx0Ly8gY2hlY2sgZWFjaCBjbGFzc05hbWUgZ2l2ZW4sIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VwZXJhdGVkIGxpc3Rcblx0XHRcdFx0XHRzdGF0ZSA9IGlzQm9vbCA/IHN0YXRlIDogIXNlbGYuaGFzQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0XHRcdHNlbGZbIHN0YXRlID8gXCJhZGRDbGFzc1wiIDogXCJyZW1vdmVDbGFzc1wiIF0oIGNsYXNzTmFtZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGUgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRcdGlmICggdGhpcy5jbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0Ly8gc3RvcmUgY2xhc3NOYW1lIGlmIHNldFxuXHRcdFx0XHRcdGpRdWVyeS5kYXRhKCB0aGlzLCBcIl9fY2xhc3NOYW1lX19cIiwgdGhpcy5jbGFzc05hbWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHRvZ2dsZSB3aG9sZSBjbGFzc05hbWVcblx0XHRcdFx0dGhpcy5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZSB8fCB2YWx1ZSA9PT0gZmFsc2UgPyBcIlwiIDogalF1ZXJ5LmRhdGEoIHRoaXMsIFwiX19jbGFzc05hbWVfX1wiICkgfHwgXCJcIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRoYXNDbGFzczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBcIiBcIiArIHNlbGVjdG9yICsgXCIgXCI7XG5cdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRpZiAoIChcIiBcIiArIHRoaXNbaV0uY2xhc3NOYW1lICsgXCIgXCIpLnJlcGxhY2UocmNsYXNzLCBcIiBcIikuaW5kZXhPZiggY2xhc3NOYW1lICkgPiAtMSApIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cdHZhbDogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdGlmICggdmFsdWUgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHZhciBlbGVtID0gdGhpc1swXTtcblxuXHRcdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0XHRpZiAoIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJvcHRpb25cIiApICkge1xuXHRcdFx0XHRcdHJldHVybiAoZWxlbS5hdHRyaWJ1dGVzLnZhbHVlIHx8IHt9KS5zcGVjaWZpZWQgPyBlbGVtLnZhbHVlIDogZWxlbS50ZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UgbmVlZCB0byBoYW5kbGUgc2VsZWN0IGJveGVzIHNwZWNpYWxcblx0XHRcdFx0aWYgKCBqUXVlcnkubm9kZU5hbWUoIGVsZW0sIFwic2VsZWN0XCIgKSApIHtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSBlbGVtLnNlbGVjdGVkSW5kZXgsXG5cdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXSxcblx0XHRcdFx0XHRcdG9wdGlvbnMgPSBlbGVtLm9wdGlvbnMsXG5cdFx0XHRcdFx0XHRvbmUgPSBlbGVtLnR5cGUgPT09IFwic2VsZWN0LW9uZVwiO1xuXG5cdFx0XHRcdFx0Ly8gTm90aGluZyB3YXMgc2VsZWN0ZWRcblx0XHRcdFx0XHRpZiAoIGluZGV4IDwgMCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlbGVjdGVkIG9wdGlvbnNcblx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IG9uZSA/IGluZGV4IDogMCwgbWF4ID0gb25lID8gaW5kZXggKyAxIDogb3B0aW9ucy5sZW5ndGg7IGkgPCBtYXg7IGkrKyApIHtcblx0XHRcdFx0XHRcdHZhciBvcHRpb24gPSBvcHRpb25zWyBpIF07XG5cblx0XHRcdFx0XHRcdGlmICggb3B0aW9uLnNlbGVjdGVkICkge1xuXHRcdFx0XHRcdFx0XHQvLyBHZXQgdGhlIHNwZWNpZmMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9yIHRoZSBvcHRpb25cblx0XHRcdFx0XHRcdFx0dmFsdWUgPSBqUXVlcnkob3B0aW9uKS52YWwoKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXZSBkb24ndCBuZWVkIGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFycmF5IGZvciBvbmUgc2VsZWN0c1xuXHRcdFx0XHRcdFx0XHRpZiAoIG9uZSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBNdWx0aS1TZWxlY3RzIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbiBhcnJheVxuXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCggdmFsdWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIGluIFdlYmtpdCBcIlwiIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgdmFsdWUgaXNuJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lmaWVkXG5cdFx0XHRcdGlmICggcnJhZGlvY2hlY2sudGVzdCggZWxlbS50eXBlICkgJiYgIWpRdWVyeS5zdXBwb3J0LmNoZWNrT24gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgPT09IG51bGwgPyBcIm9uXCIgOiBlbGVtLnZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXG5cdFx0XHRcdC8vIEV2ZXJ5dGhpbmcgZWxzZSwgd2UganVzdCBncmFiIHRoZSB2YWx1ZVxuXHRcdFx0XHRyZXR1cm4gKGVsZW0udmFsdWUgfHwgXCJcIikucmVwbGFjZShycmV0dXJuLCBcIlwiKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHZhciBpc0Z1bmN0aW9uID0galF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSh0aGlzKSwgdmFsID0gdmFsdWU7XG5cblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSAhPT0gMSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzRnVuY3Rpb24gKSB7XG5cdFx0XHRcdHZhbCA9IHZhbHVlLmNhbGwodGhpcywgaSwgc2VsZi52YWwoKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFR5cGVjYXN0IGVhY2ggdGltZSBpZiB0aGUgdmFsdWUgaXMgYSBGdW5jdGlvbiBhbmQgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcHBlbmRlZFxuXHRcdFx0Ly8gdmFsdWUgaXMgdGhlcmVmb3JlIGRpZmZlcmVudCBlYWNoIHRpbWUuXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRcdHZhbCArPSBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KHZhbCkgJiYgcnJhZGlvY2hlY2sudGVzdCggdGhpcy50eXBlICkgKSB7XG5cdFx0XHRcdHRoaXMuY2hlY2tlZCA9IGpRdWVyeS5pbkFycmF5KCBzZWxmLnZhbCgpLCB2YWwgKSA+PSAwO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBqUXVlcnkubm9kZU5hbWUoIHRoaXMsIFwic2VsZWN0XCIgKSApIHtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGpRdWVyeS5tYWtlQXJyYXkodmFsKTtcblxuXHRcdFx0XHRqUXVlcnkoIFwib3B0aW9uXCIsIHRoaXMgKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBqUXVlcnkuaW5BcnJheSggalF1ZXJ5KHRoaXMpLnZhbCgpLCB2YWx1ZXMgKSA+PSAwO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoICF2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0YXR0ckZuOiB7XG5cdFx0dmFsOiB0cnVlLFxuXHRcdGNzczogdHJ1ZSxcblx0XHRodG1sOiB0cnVlLFxuXHRcdHRleHQ6IHRydWUsXG5cdFx0ZGF0YTogdHJ1ZSxcblx0XHR3aWR0aDogdHJ1ZSxcblx0XHRoZWlnaHQ6IHRydWUsXG5cdFx0b2Zmc2V0OiB0cnVlXG5cdH0sXG5cdFx0XG5cdGF0dHI6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSwgcGFzcyApIHtcblx0XHQvLyBkb24ndCBzZXQgYXR0cmlidXRlcyBvbiB0ZXh0IGFuZCBjb21tZW50IG5vZGVzXG5cdFx0aWYgKCAhZWxlbSB8fCBlbGVtLm5vZGVUeXBlID09PSAzIHx8IGVsZW0ubm9kZVR5cGUgPT09IDggKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdGlmICggcGFzcyAmJiBuYW1lIGluIGpRdWVyeS5hdHRyRm4gKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5KGVsZW0pW25hbWVdKHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YXIgbm90eG1sID0gZWxlbS5ub2RlVHlwZSAhPT0gMSB8fCAhalF1ZXJ5LmlzWE1MRG9jKCBlbGVtICksXG5cdFx0XHQvLyBXaGV0aGVyIHdlIGFyZSBzZXR0aW5nIChvciBnZXR0aW5nKVxuXHRcdFx0c2V0ID0gdmFsdWUgIT09IHVuZGVmaW5lZDtcblxuXHRcdC8vIFRyeSB0byBub3JtYWxpemUvZml4IHRoZSBuYW1lXG5cdFx0bmFtZSA9IG5vdHhtbCAmJiBqUXVlcnkucHJvcHNbIG5hbWUgXSB8fCBuYW1lO1xuXG5cdFx0Ly8gT25seSBkbyBhbGwgdGhlIGZvbGxvd2luZyBpZiB0aGlzIGlzIGEgbm9kZSAoZmFzdGVyIGZvclxuICAgICAgICAgICAgICAgIC8vIHN0eWxlKVxuXHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdC8vIFRoZXNlIGF0dHJpYnV0ZXMgcmVxdWlyZSBzcGVjaWFsIHRyZWF0bWVudFxuXHRcdFx0dmFyIHNwZWNpYWwgPSByc3BlY2lhbHVybC50ZXN0KCBuYW1lICk7XG5cblx0XHRcdC8vIFNhZmFyaSBtaXMtcmVwb3J0cyB0aGUgZGVmYXVsdCBzZWxlY3RlZCBwcm9wZXJ0eSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW4gb3B0aW9uXG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhlIHBhcmVudCdzIHNlbGVjdGVkSW5kZXggcHJvcGVydHkgZml4ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0XG5cdFx0XHRpZiAoIG5hbWUgPT09IFwic2VsZWN0ZWRcIiAmJiAhalF1ZXJ5LnN1cHBvcnQub3B0U2VsZWN0ZWQgKSB7XG5cdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdGlmICggcGFyZW50ICkge1xuXHRcdFx0XHRcdHBhcmVudC5zZWxlY3RlZEluZGV4O1xuXHRcblx0XHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBpdCBhbHNvIHdvcmtzIHdpdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRncm91cHMsIHNlZSAjNTcwMVxuXHRcdFx0XHRcdGlmICggcGFyZW50LnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0XHRwYXJlbnQucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBhcHBsaWNhYmxlLCBhY2Nlc3MgdGhlIGF0dHJpYnV0ZSB2aWEgdGhlIERPTSAwIHdheVxuXHRcdFx0aWYgKCBuYW1lIGluIGVsZW0gJiYgbm90eG1sICYmICFzcGVjaWFsICkge1xuXHRcdFx0XHRpZiAoIHNldCApIHtcblx0XHRcdFx0XHQvLyBXZSBjYW4ndCBhbGxvdyB0aGUgdHlwZSBwcm9wZXJ0eSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlIGNoYW5nZWQgKHNpbmNlIGl0IGNhdXNlcyBwcm9ibGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIElFKVxuXHRcdFx0XHRcdGlmICggbmFtZSA9PT0gXCJ0eXBlXCIgJiYgcnR5cGUudGVzdCggZWxlbS5ub2RlTmFtZSApICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5lcnJvciggXCJ0eXBlIHByb3BlcnR5IGNhbid0IGJlIGNoYW5nZWRcIiApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVsZW1bIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYnJvd3NlcnMgaW5kZXggZWxlbWVudHMgYnkgaWQvbmFtZSBvbiBmb3JtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2l2ZSBwcmlvcml0eSB0byBhdHRyaWJ1dGVzLlxuXHRcdFx0XHRpZiAoIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJmb3JtXCIgKSAmJiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUobmFtZSkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApLm5vZGVWYWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVsZW0udGFiSW5kZXggZG9lc24ndCBhbHdheXMgcmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3JyZWN0IHZhbHVlIHdoZW4gaXQgaGFzbid0IGJlZW4gZXhwbGljaXRseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRcblx0XHRcdFx0Ly8gaHR0cDovL2ZsdWlkcHJvamVjdC5vcmcvYmxvZy8yMDA4LzAxLzA5L2dldHRpbmctc2V0dGluZy1hbmQtcmVtb3ZpbmctdGFiaW5kZXgtdmFsdWVzLXdpdGgtamF2YXNjcmlwdC9cblx0XHRcdFx0aWYgKCBuYW1lID09PSBcInRhYkluZGV4XCIgKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZU5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwidGFiSW5kZXhcIiApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZU5vZGUgJiYgYXR0cmlidXRlTm9kZS5zcGVjaWZpZWQgP1xuXHRcdFx0XHRcdFx0YXR0cmlidXRlTm9kZS52YWx1ZSA6XG5cdFx0XHRcdFx0XHRyZm9jdXNhYmxlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSB8fCByY2xpY2thYmxlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSAmJiBlbGVtLmhyZWYgP1xuXHRcdFx0XHRcdFx0XHQwIDpcblx0XHRcdFx0XHRcdFx0dW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVsZW1bIG5hbWUgXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQuc3R5bGUgJiYgbm90eG1sICYmIG5hbWUgPT09IFwic3R5bGVcIiApIHtcblx0XHRcdFx0aWYgKCBzZXQgKSB7XG5cdFx0XHRcdFx0ZWxlbS5zdHlsZS5jc3NUZXh0ID0gXCJcIiArIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVsZW0uc3R5bGUuY3NzVGV4dDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzZXQgKSB7XG5cdFx0XHRcdC8vIGNvbnZlcnQgdGhlIHZhbHVlIHRvIGEgc3RyaW5nIChhbGwgYnJvd3NlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gdGhpcyBidXQgSUUpIHNlZSAjMTA3MFxuXHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSggbmFtZSwgXCJcIiArIHZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBhdHRyID0gIWpRdWVyeS5zdXBwb3J0LmhyZWZOb3JtYWxpemVkICYmIG5vdHhtbCAmJiBzcGVjaWFsID9cblx0XHRcdFx0XHQvLyBTb21lIGF0dHJpYnV0ZXMgcmVxdWlyZSBhIHNwZWNpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIG9uIElFXG5cdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIDIgKSA6XG5cdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblxuXHRcdFx0Ly8gTm9uLWV4aXN0ZW50IGF0dHJpYnV0ZXMgcmV0dXJuIG51bGwsIHdlIG5vcm1hbGl6ZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5kZWZpbmVkXG5cdFx0XHRyZXR1cm4gYXR0ciA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IGF0dHI7XG5cdFx0fVxuXG5cdFx0Ly8gZWxlbSBpcyBhY3R1YWxseSBlbGVtLnN0eWxlIC4uLiBzZXQgdGhlIHN0eWxlXG5cdFx0Ly8gVXNpbmcgYXR0ciBmb3Igc3BlY2lmaWMgc3R5bGUgaW5mb3JtYXRpb24gaXMgbm93IGRlcHJlY2F0ZWQuXG4gICAgICAgICAgICAgICAgLy8gVXNlIHN0eWxlIGluc3RlYWQuXG5cdFx0cmV0dXJuIGpRdWVyeS5zdHlsZSggZWxlbSwgbmFtZSwgdmFsdWUgKTtcblx0fVxufSk7XG52YXIgcm5hbWVzcGFjZXMgPSAvXFwuKC4qKSQvLFxuXHRmY2xlYW51cCA9IGZ1bmN0aW9uKCBubSApIHtcblx0XHRyZXR1cm4gbm0ucmVwbGFjZSgvW15cXHdcXHNcXC5cXHxgXS9nLCBmdW5jdGlvbiggY2ggKSB7XG5cdFx0XHRyZXR1cm4gXCJcXFxcXCIgKyBjaDtcblx0XHR9KTtcblx0fTtcblxuLypcbiAqIEEgbnVtYmVyIG9mIGhlbHBlciBmdW5jdGlvbnMgdXNlZCBmb3IgbWFuYWdpbmcgZXZlbnRzLiBNYW55IG9mIHRoZSBpZGVhc1xuICogYmVoaW5kIHRoaXMgY29kZSBvcmlnaW5hdGVkIGZyb20gRGVhbiBFZHdhcmRzJyBhZGRFdmVudCBsaWJyYXJ5LlxuICovXG5qUXVlcnkuZXZlbnQgPSB7XG5cblx0Ly8gQmluZCBhbiBldmVudCB0byBhbiBlbGVtZW50XG5cdC8vIE9yaWdpbmFsIGJ5IERlYW4gRWR3YXJkc1xuXHRhZGQ6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlcywgaGFuZGxlciwgZGF0YSApIHtcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBGb3Igd2hhdGV2ZXIgcmVhc29uLCBJRSBoYXMgdHJvdWJsZSBwYXNzaW5nIHRoZSB3aW5kb3cgb2JqZWN0XG5cdFx0Ly8gYXJvdW5kLCBjYXVzaW5nIGl0IHRvIGJlIGNsb25lZCBpbiB0aGUgcHJvY2Vzc1xuXHRcdGlmICggZWxlbS5zZXRJbnRlcnZhbCAmJiAoIGVsZW0gIT09IHdpbmRvdyAmJiAhZWxlbS5mcmFtZUVsZW1lbnQgKSApIHtcblx0XHRcdGVsZW0gPSB3aW5kb3c7XG5cdFx0fVxuXG5cdFx0dmFyIGhhbmRsZU9iakluLCBoYW5kbGVPYmo7XG5cblx0XHRpZiAoIGhhbmRsZXIuaGFuZGxlciApIHtcblx0XHRcdGhhbmRsZU9iakluID0gaGFuZGxlcjtcblx0XHRcdGhhbmRsZXIgPSBoYW5kbGVPYmpJbi5oYW5kbGVyO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZCBoYXMgYSB1bmlxdWUgSURcblx0XHRpZiAoICFoYW5kbGVyLmd1aWQgKSB7XG5cdFx0XHRoYW5kbGVyLmd1aWQgPSBqUXVlcnkuZ3VpZCsrO1xuXHRcdH1cblxuXHRcdC8vIEluaXQgdGhlIGVsZW1lbnQncyBldmVudCBzdHJ1Y3R1cmVcblx0XHR2YXIgZWxlbURhdGEgPSBqUXVlcnkuZGF0YSggZWxlbSApO1xuXG5cdFx0Ly8gSWYgbm8gZWxlbURhdGEgaXMgZm91bmQgdGhlbiB3ZSBtdXN0IGJlIHRyeWluZyB0byBiaW5kIHRvIG9uZVxuICAgICAgICAgICAgICAgIC8vIG9mIHRoZVxuXHRcdC8vIGJhbm5lZCBub0RhdGEgZWxlbWVudHNcblx0XHRpZiAoICFlbGVtRGF0YSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzIHx8IHt9LFxuXHRcdFx0ZXZlbnRIYW5kbGUgPSBlbGVtRGF0YS5oYW5kbGUsIGV2ZW50SGFuZGxlO1xuXG5cdFx0aWYgKCAhZXZlbnRIYW5kbGUgKSB7XG5cdFx0XHRlbGVtRGF0YS5oYW5kbGUgPSBldmVudEhhbmRsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHNlY29uZCBldmVudCBvZiBhIHRyaWdnZXIgYW5kIHdoZW5cblx0XHRcdFx0Ly8gYW4gZXZlbnQgaXMgY2FsbGVkIGFmdGVyIGEgcGFnZSBoYXMgdW5sb2FkZWRcblx0XHRcdFx0cmV0dXJuIHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgIWpRdWVyeS5ldmVudC50cmlnZ2VyZWQgP1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5oYW5kbGUuYXBwbHkoIGV2ZW50SGFuZGxlLmVsZW0sIGFyZ3VtZW50cyApIDpcblx0XHRcdFx0XHR1bmRlZmluZWQ7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIEFkZCBlbGVtIGFzIGEgcHJvcGVydHkgb2YgdGhlIGhhbmRsZSBmdW5jdGlvblxuXHRcdC8vIFRoaXMgaXMgdG8gcHJldmVudCBhIG1lbW9yeSBsZWFrIHdpdGggbm9uLW5hdGl2ZSBldmVudHMgaW5cbiAgICAgICAgICAgICAgICAvLyBJRS5cblx0XHRldmVudEhhbmRsZS5lbGVtID0gZWxlbTtcblxuXHRcdC8vIEhhbmRsZSBtdWx0aXBsZSBldmVudHMgc2VwYXJhdGVkIGJ5IGEgc3BhY2Vcblx0XHQvLyBqUXVlcnkoLi4uKS5iaW5kKFwibW91c2VvdmVyIG1vdXNlb3V0XCIsIGZuKTtcblx0XHR0eXBlcyA9IHR5cGVzLnNwbGl0KFwiIFwiKTtcblxuXHRcdHZhciB0eXBlLCBpID0gMCwgbmFtZXNwYWNlcztcblxuXHRcdHdoaWxlICggKHR5cGUgPSB0eXBlc1sgaSsrIF0pICkge1xuXHRcdFx0aGFuZGxlT2JqID0gaGFuZGxlT2JqSW4gP1xuXHRcdFx0XHRqUXVlcnkuZXh0ZW5kKHt9LCBoYW5kbGVPYmpJbikgOlxuXHRcdFx0XHR7IGhhbmRsZXI6IGhhbmRsZXIsIGRhdGE6IGRhdGEgfTtcblxuXHRcdFx0Ly8gTmFtZXNwYWNlZCBldmVudCBoYW5kbGVyc1xuXHRcdFx0aWYgKCB0eXBlLmluZGV4T2YoXCIuXCIpID4gLTEgKSB7XG5cdFx0XHRcdG5hbWVzcGFjZXMgPSB0eXBlLnNwbGl0KFwiLlwiKTtcblx0XHRcdFx0dHlwZSA9IG5hbWVzcGFjZXMuc2hpZnQoKTtcblx0XHRcdFx0aGFuZGxlT2JqLm5hbWVzcGFjZSA9IG5hbWVzcGFjZXMuc2xpY2UoMCkuc29ydCgpLmpvaW4oXCIuXCIpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYW1lc3BhY2VzID0gW107XG5cdFx0XHRcdGhhbmRsZU9iai5uYW1lc3BhY2UgPSBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRoYW5kbGVPYmoudHlwZSA9IHR5cGU7XG5cdFx0XHRoYW5kbGVPYmouZ3VpZCA9IGhhbmRsZXIuZ3VpZDtcblxuXHRcdFx0Ly8gR2V0IHRoZSBjdXJyZW50IGxpc3Qgb2YgZnVuY3Rpb25zIGJvdW5kIHRvIHRoaXMgZXZlbnRcblx0XHRcdHZhciBoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdLFxuXHRcdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0Ly8gSW5pdCB0aGUgZXZlbnQgaGFuZGxlciBxdWV1ZVxuXHRcdFx0aWYgKCAhaGFuZGxlcnMgKSB7XG5cdFx0XHRcdGhhbmRsZXJzID0gZXZlbnRzWyB0eXBlIF0gPSBbXTtcblxuXHRcdFx0XHQvLyBDaGVjayBmb3IgYSBzcGVjaWFsIGV2ZW50IGhhbmRsZXJcblx0XHRcdFx0Ly8gT25seSB1c2UgYWRkRXZlbnRMaXN0ZW5lci9hdHRhY2hFdmVudCBpZiB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbFxuXHRcdFx0XHQvLyBldmVudHMgaGFuZGxlciByZXR1cm5zIGZhbHNlXG5cdFx0XHRcdGlmICggIXNwZWNpYWwuc2V0dXAgfHwgc3BlY2lhbC5zZXR1cC5jYWxsKCBlbGVtLCBkYXRhLCBuYW1lc3BhY2VzLCBldmVudEhhbmRsZSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHQvLyBCaW5kIHRoZSBnbG9iYWwgZXZlbnQgaGFuZGxlciB0byB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50XG5cdFx0XHRcdFx0aWYgKCBlbGVtLmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHRcdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggZWxlbS5hdHRhY2hFdmVudCApIHtcblx0XHRcdFx0XHRcdGVsZW0uYXR0YWNoRXZlbnQoIFwib25cIiArIHR5cGUsIGV2ZW50SGFuZGxlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICggc3BlY2lhbC5hZGQgKSB7IFxuXHRcdFx0XHRzcGVjaWFsLmFkZC5jYWxsKCBlbGVtLCBoYW5kbGVPYmogKTsgXG5cblx0XHRcdFx0aWYgKCAhaGFuZGxlT2JqLmhhbmRsZXIuZ3VpZCApIHtcblx0XHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlci5ndWlkID0gaGFuZGxlci5ndWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB0aGUgZnVuY3Rpb24gdG8gdGhlIGVsZW1lbnQncyBoYW5kbGVyIGxpc3Rcblx0XHRcdGhhbmRsZXJzLnB1c2goIGhhbmRsZU9iaiApO1xuXG5cdFx0XHQvLyBLZWVwIHRyYWNrIG9mIHdoaWNoIGV2ZW50cyBoYXZlIGJlZW4gdXNlZCwgZm9yIGdsb2JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJpZ2dlcmluZ1xuXHRcdFx0alF1ZXJ5LmV2ZW50Lmdsb2JhbFsgdHlwZSBdID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBOdWxsaWZ5IGVsZW0gdG8gcHJldmVudCBtZW1vcnkgbGVha3MgaW4gSUVcblx0XHRlbGVtID0gbnVsbDtcblx0fSxcblxuXHRnbG9iYWw6IHt9LFxuXG5cdC8vIERldGFjaCBhbiBldmVudCBvciBzZXQgb2YgZXZlbnRzIGZyb20gYW4gZWxlbWVudFxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlcywgaGFuZGxlciwgcG9zICkge1xuXHRcdC8vIGRvbid0IGRvIGV2ZW50cyBvbiB0ZXh0IGFuZCBjb21tZW50IG5vZGVzXG5cdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAzIHx8IGVsZW0ubm9kZVR5cGUgPT09IDggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHJldCwgdHlwZSwgZm4sIGkgPSAwLCBhbGwsIG5hbWVzcGFjZXMsIG5hbWVzcGFjZSwgc3BlY2lhbCwgZXZlbnRUeXBlLCBoYW5kbGVPYmosIG9yaWdUeXBlLFxuXHRcdFx0ZWxlbURhdGEgPSBqUXVlcnkuZGF0YSggZWxlbSApLFxuXHRcdFx0ZXZlbnRzID0gZWxlbURhdGEgJiYgZWxlbURhdGEuZXZlbnRzO1xuXG5cdFx0aWYgKCAhZWxlbURhdGEgfHwgIWV2ZW50cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB0eXBlcyBpcyBhY3R1YWxseSBhbiBldmVudCBvYmplY3QgaGVyZVxuXHRcdGlmICggdHlwZXMgJiYgdHlwZXMudHlwZSApIHtcblx0XHRcdGhhbmRsZXIgPSB0eXBlcy5oYW5kbGVyO1xuXHRcdFx0dHlwZXMgPSB0eXBlcy50eXBlO1xuXHRcdH1cblxuXHRcdC8vIFVuYmluZCBhbGwgZXZlbnRzIGZvciB0aGUgZWxlbWVudFxuXHRcdGlmICggIXR5cGVzIHx8IHR5cGVvZiB0eXBlcyA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlcy5jaGFyQXQoMCkgPT09IFwiLlwiICkge1xuXHRcdFx0dHlwZXMgPSB0eXBlcyB8fCBcIlwiO1xuXG5cdFx0XHRmb3IgKCB0eXBlIGluIGV2ZW50cyApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSArIHR5cGVzICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgbXVsdGlwbGUgZXZlbnRzIHNlcGFyYXRlZCBieSBhIHNwYWNlXG5cdFx0Ly8galF1ZXJ5KC4uLikudW5iaW5kKFwibW91c2VvdmVyIG1vdXNlb3V0XCIsIGZuKTtcblx0XHR0eXBlcyA9IHR5cGVzLnNwbGl0KFwiIFwiKTtcblxuXHRcdHdoaWxlICggKHR5cGUgPSB0eXBlc1sgaSsrIF0pICkge1xuXHRcdFx0b3JpZ1R5cGUgPSB0eXBlO1xuXHRcdFx0aGFuZGxlT2JqID0gbnVsbDtcblx0XHRcdGFsbCA9IHR5cGUuaW5kZXhPZihcIi5cIikgPCAwO1xuXHRcdFx0bmFtZXNwYWNlcyA9IFtdO1xuXG5cdFx0XHRpZiAoICFhbGwgKSB7XG5cdFx0XHRcdC8vIE5hbWVzcGFjZWQgZXZlbnQgaGFuZGxlcnNcblx0XHRcdFx0bmFtZXNwYWNlcyA9IHR5cGUuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHR0eXBlID0gbmFtZXNwYWNlcy5zaGlmdCgpO1xuXG5cdFx0XHRcdG5hbWVzcGFjZSA9IG5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIiArIFxuXHRcdFx0XHRcdGpRdWVyeS5tYXAoIG5hbWVzcGFjZXMuc2xpY2UoMCkuc29ydCgpLCBmY2xlYW51cCApLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC4pP1wiKSArIFwiKFxcXFwufCQpXCIpXG5cdFx0XHR9XG5cblx0XHRcdGV2ZW50VHlwZSA9IGV2ZW50c1sgdHlwZSBdO1xuXG5cdFx0XHRpZiAoICFldmVudFR5cGUgKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICFoYW5kbGVyICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgaiA9IDA7IGogPCBldmVudFR5cGUubGVuZ3RoOyBqKysgKSB7XG5cdFx0XHRcdFx0aGFuZGxlT2JqID0gZXZlbnRUeXBlWyBqIF07XG5cblx0XHRcdFx0XHRpZiAoIGFsbCB8fCBuYW1lc3BhY2UudGVzdCggaGFuZGxlT2JqLm5hbWVzcGFjZSApICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgb3JpZ1R5cGUsIGhhbmRsZU9iai5oYW5kbGVyLCBqICk7XG5cdFx0XHRcdFx0XHRldmVudFR5cGUuc3BsaWNlKCBqLS0sIDEgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyB0eXBlIF0gfHwge307XG5cblx0XHRcdGZvciAoIHZhciBqID0gcG9zIHx8IDA7IGogPCBldmVudFR5cGUubGVuZ3RoOyBqKysgKSB7XG5cdFx0XHRcdGhhbmRsZU9iaiA9IGV2ZW50VHlwZVsgaiBdO1xuXG5cdFx0XHRcdGlmICggaGFuZGxlci5ndWlkID09PSBoYW5kbGVPYmouZ3VpZCApIHtcblx0XHRcdFx0XHQvLyByZW1vdmUgdGhlIGdpdmVuIGhhbmRsZXIgZm9yIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpdmVuIHR5cGVcblx0XHRcdFx0XHRpZiAoIGFsbCB8fCBuYW1lc3BhY2UudGVzdCggaGFuZGxlT2JqLm5hbWVzcGFjZSApICkge1xuXHRcdFx0XHRcdFx0aWYgKCBwb3MgPT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdFx0ZXZlbnRUeXBlLnNwbGljZSggai0tLCAxICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICggc3BlY2lhbC5yZW1vdmUgKSB7XG5cdFx0XHRcdFx0XHRcdHNwZWNpYWwucmVtb3ZlLmNhbGwoIGVsZW0sIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcG9zICE9IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVtb3ZlIGdlbmVyaWMgZXZlbnQgaGFuZGxlciBpZiBubyBtb3JlIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleGlzdFxuXHRcdFx0aWYgKCBldmVudFR5cGUubGVuZ3RoID09PSAwIHx8IHBvcyAhPSBudWxsICYmIGV2ZW50VHlwZS5sZW5ndGggPT09IDEgKSB7XG5cdFx0XHRcdGlmICggIXNwZWNpYWwudGVhcmRvd24gfHwgc3BlY2lhbC50ZWFyZG93bi5jYWxsKCBlbGVtLCBuYW1lc3BhY2VzICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdHJlbW92ZUV2ZW50KCBlbGVtLCB0eXBlLCBlbGVtRGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldCA9IG51bGw7XG5cdFx0XHRcdGRlbGV0ZSBldmVudHNbIHR5cGUgXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgdGhlIGV4cGFuZG8gaWYgaXQncyBubyBsb25nZXIgdXNlZFxuXHRcdGlmICggalF1ZXJ5LmlzRW1wdHlPYmplY3QoIGV2ZW50cyApICkge1xuXHRcdFx0dmFyIGhhbmRsZSA9IGVsZW1EYXRhLmhhbmRsZTtcblx0XHRcdGlmICggaGFuZGxlICkge1xuXHRcdFx0XHRoYW5kbGUuZWxlbSA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGRlbGV0ZSBlbGVtRGF0YS5ldmVudHM7XG5cdFx0XHRkZWxldGUgZWxlbURhdGEuaGFuZGxlO1xuXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0VtcHR5T2JqZWN0KCBlbGVtRGF0YSApICkge1xuXHRcdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBidWJibGluZyBpcyBpbnRlcm5hbFxuXHR0cmlnZ2VyOiBmdW5jdGlvbiggZXZlbnQsIGRhdGEsIGVsZW0gLyogLCBidWJibGluZyAqLyApIHtcblx0XHQvLyBFdmVudCBvYmplY3Qgb3IgZXZlbnQgdHlwZVxuXHRcdHZhciB0eXBlID0gZXZlbnQudHlwZSB8fCBldmVudCxcblx0XHRcdGJ1YmJsaW5nID0gYXJndW1lbnRzWzNdO1xuXG5cdFx0aWYgKCAhYnViYmxpbmcgKSB7XG5cdFx0XHRldmVudCA9IHR5cGVvZiBldmVudCA9PT0gXCJvYmplY3RcIiA/XG5cdFx0XHRcdC8vIGpRdWVyeS5FdmVudCBvYmplY3Rcblx0XHRcdFx0ZXZlbnRbZXhwYW5kb10gPyBldmVudCA6XG5cdFx0XHRcdC8vIE9iamVjdCBsaXRlcmFsXG5cdFx0XHRcdGpRdWVyeS5leHRlbmQoIGpRdWVyeS5FdmVudCh0eXBlKSwgZXZlbnQgKSA6XG5cdFx0XHRcdC8vIEp1c3QgdGhlIGV2ZW50IHR5cGUgKHN0cmluZylcblx0XHRcdFx0alF1ZXJ5LkV2ZW50KHR5cGUpO1xuXG5cdFx0XHRpZiAoIHR5cGUuaW5kZXhPZihcIiFcIikgPj0gMCApIHtcblx0XHRcdFx0ZXZlbnQudHlwZSA9IHR5cGUgPSB0eXBlLnNsaWNlKDAsIC0xKTtcblx0XHRcdFx0ZXZlbnQuZXhjbHVzaXZlID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGFuZGxlIGEgZ2xvYmFsIHRyaWdnZXJcblx0XHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRcdC8vIERvbid0IGJ1YmJsZSBjdXN0b20gZXZlbnRzIHdoZW4gZ2xvYmFsICh0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCB0b28gbXVjaCBvdmVyaGVhZClcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0Ly8gT25seSB0cmlnZ2VyIGlmIHdlJ3ZlIGV2ZXIgYm91bmQgYW4gZXZlbnQgZm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0XG5cdFx0XHRcdGlmICggalF1ZXJ5LmV2ZW50Lmdsb2JhbFsgdHlwZSBdICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCBqUXVlcnkuY2FjaGUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGlzLmV2ZW50cyAmJiB0aGlzLmV2ZW50c1t0eXBlXSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIGV2ZW50LCBkYXRhLCB0aGlzLmhhbmRsZS5lbGVtICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSGFuZGxlIHRyaWdnZXJpbmcgYSBzaW5nbGUgZWxlbWVudFxuXG5cdFx0XHQvLyBkb24ndCBkbyBldmVudHMgb24gdGV4dCBhbmQgY29tbWVudCBub2Rlc1xuXHRcdFx0aWYgKCAhZWxlbSB8fCBlbGVtLm5vZGVUeXBlID09PSAzIHx8IGVsZW0ubm9kZVR5cGUgPT09IDggKSB7XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENsZWFuIHVwIGluIGNhc2UgaXQgaXMgcmV1c2VkXG5cdFx0XHRldmVudC5yZXN1bHQgPSB1bmRlZmluZWQ7XG5cdFx0XHRldmVudC50YXJnZXQgPSBlbGVtO1xuXG5cdFx0XHQvLyBDbG9uZSB0aGUgaW5jb21pbmcgZGF0YSwgaWYgYW55XG5cdFx0XHRkYXRhID0galF1ZXJ5Lm1ha2VBcnJheSggZGF0YSApO1xuXHRcdFx0ZGF0YS51bnNoaWZ0KCBldmVudCApO1xuXHRcdH1cblxuXHRcdGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBlbGVtO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgZXZlbnQsIGl0IGlzIGFzc3VtZWQgdGhhdCBcImhhbmRsZVwiIGlzIGEgZnVuY3Rpb25cblx0XHR2YXIgaGFuZGxlID0galF1ZXJ5LmRhdGEoIGVsZW0sIFwiaGFuZGxlXCIgKTtcblx0XHRpZiAoIGhhbmRsZSApIHtcblx0XHRcdGhhbmRsZS5hcHBseSggZWxlbSwgZGF0YSApO1xuXHRcdH1cblxuXHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUgfHwgZWxlbS5vd25lckRvY3VtZW50O1xuXG5cdFx0Ly8gVHJpZ2dlciBhbiBpbmxpbmUgYm91bmQgc2NyaXB0XG5cdFx0dHJ5IHtcblx0XHRcdGlmICggIShlbGVtICYmIGVsZW0ubm9kZU5hbWUgJiYgalF1ZXJ5Lm5vRGF0YVtlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtWyBcIm9uXCIgKyB0eXBlIF0gJiYgZWxlbVsgXCJvblwiICsgdHlwZSBdLmFwcGx5KCBlbGVtLCBkYXRhICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdGV2ZW50LnJlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBwcmV2ZW50IElFIGZyb20gdGhyb3dpbmcgYW4gZXJyb3IgZm9yIHNvbWUgZWxlbWVudHMgd2l0aCBzb21lXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgdHlwZXMsIHNlZSAjMzUzM1xuXHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRpZiAoICFldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpICYmIHBhcmVudCApIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBldmVudCwgZGF0YSwgcGFyZW50LCB0cnVlICk7XG5cblx0XHR9IGVsc2UgaWYgKCAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LCBvbGQsXG5cdFx0XHRcdGlzQ2xpY2sgPSBqUXVlcnkubm9kZU5hbWUodGFyZ2V0LCBcImFcIikgJiYgdHlwZSA9PT0gXCJjbGlja1wiLFxuXHRcdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0aWYgKCAoIXNwZWNpYWwuX2RlZmF1bHQgfHwgc3BlY2lhbC5fZGVmYXVsdC5jYWxsKCBlbGVtLCBldmVudCApID09PSBmYWxzZSkgJiYgXG5cdFx0XHRcdCFpc0NsaWNrICYmICEodGFyZ2V0ICYmIHRhcmdldC5ub2RlTmFtZSAmJiBqUXVlcnkubm9EYXRhW3RhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSkgKSB7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoIHRhcmdldFsgdHlwZSBdICkge1xuXHRcdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFjY2lkZW50YWxseSByZS10cmlnZ2VyIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25GT08gZXZlbnRzXG5cdFx0XHRcdFx0XHRvbGQgPSB0YXJnZXRbIFwib25cIiArIHR5cGUgXTtcblxuXHRcdFx0XHRcdFx0aWYgKCBvbGQgKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldFsgXCJvblwiICsgdHlwZSBdID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR0YXJnZXRbIHR5cGUgXSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBwcmV2ZW50IElFIGZyb20gdGhyb3dpbmcgYW4gZXJyb3IgZm9yIHNvbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudHMgd2l0aCBzb21lIGV2ZW50IHR5cGVzLCBzZWUgIzM1MzNcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIG9sZCApIHtcblx0XHRcdFx0XHR0YXJnZXRbIFwib25cIiArIHR5cGUgXSA9IG9sZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGFsbCwgaGFuZGxlcnMsIG5hbWVzcGFjZXMsIG5hbWVzcGFjZSwgZXZlbnRzO1xuXG5cdFx0ZXZlbnQgPSBhcmd1bWVudHNbMF0gPSBqUXVlcnkuZXZlbnQuZml4KCBldmVudCB8fCB3aW5kb3cuZXZlbnQgKTtcblx0XHRldmVudC5jdXJyZW50VGFyZ2V0ID0gdGhpcztcblxuXHRcdC8vIE5hbWVzcGFjZWQgZXZlbnQgaGFuZGxlcnNcblx0XHRhbGwgPSBldmVudC50eXBlLmluZGV4T2YoXCIuXCIpIDwgMCAmJiAhZXZlbnQuZXhjbHVzaXZlO1xuXG5cdFx0aWYgKCAhYWxsICkge1xuXHRcdFx0bmFtZXNwYWNlcyA9IGV2ZW50LnR5cGUuc3BsaXQoXCIuXCIpO1xuXHRcdFx0ZXZlbnQudHlwZSA9IG5hbWVzcGFjZXMuc2hpZnQoKTtcblx0XHRcdG5hbWVzcGFjZSA9IG5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIiArIG5hbWVzcGFjZXMuc2xpY2UoMCkuc29ydCgpLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC4pP1wiKSArIFwiKFxcXFwufCQpXCIpO1xuXHRcdH1cblxuXHRcdHZhciBldmVudHMgPSBqUXVlcnkuZGF0YSh0aGlzLCBcImV2ZW50c1wiKSwgaGFuZGxlcnMgPSBldmVudHNbIGV2ZW50LnR5cGUgXTtcblxuXHRcdGlmICggZXZlbnRzICYmIGhhbmRsZXJzICkge1xuXHRcdFx0Ly8gQ2xvbmUgdGhlIGhhbmRsZXJzIHRvIHByZXZlbnQgbWFuaXB1bGF0aW9uXG5cdFx0XHRoYW5kbGVycyA9IGhhbmRsZXJzLnNsaWNlKDApO1xuXG5cdFx0XHRmb3IgKCB2YXIgaiA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGogPCBsOyBqKysgKSB7XG5cdFx0XHRcdHZhciBoYW5kbGVPYmogPSBoYW5kbGVyc1sgaiBdO1xuXG5cdFx0XHRcdC8vIEZpbHRlciB0aGUgZnVuY3Rpb25zIGJ5IGNsYXNzXG5cdFx0XHRcdGlmICggYWxsIHx8IG5hbWVzcGFjZS50ZXN0KCBoYW5kbGVPYmoubmFtZXNwYWNlICkgKSB7XG5cdFx0XHRcdFx0Ly8gUGFzcyBpbiBhIHJlZmVyZW5jZSB0byB0aGUgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGl0c2VsZlxuXHRcdFx0XHRcdC8vIFNvIHRoYXQgd2UgY2FuIGxhdGVyIHJlbW92ZSBpdFxuXHRcdFx0XHRcdGV2ZW50LmhhbmRsZXIgPSBoYW5kbGVPYmouaGFuZGxlcjtcblx0XHRcdFx0XHRldmVudC5kYXRhID0gaGFuZGxlT2JqLmRhdGE7XG5cdFx0XHRcdFx0ZXZlbnQuaGFuZGxlT2JqID0gaGFuZGxlT2JqO1xuXHRcblx0XHRcdFx0XHR2YXIgcmV0ID0gaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0XHRcdFx0aWYgKCByZXQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRcdGV2ZW50LnJlc3VsdCA9IHJldDtcblx0XHRcdFx0XHRcdGlmICggcmV0ID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBldmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV2ZW50LnJlc3VsdDtcblx0fSxcblxuXHRwcm9wczogXCJhbHRLZXkgYXR0ckNoYW5nZSBhdHRyTmFtZSBidWJibGVzIGJ1dHRvbiBjYW5jZWxhYmxlIGNoYXJDb2RlIGNsaWVudFggY2xpZW50WSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgZGF0YSBkZXRhaWwgZXZlbnRQaGFzZSBmcm9tRWxlbWVudCBoYW5kbGVyIGtleUNvZGUgbGF5ZXJYIGxheWVyWSBtZXRhS2V5IG5ld1ZhbHVlIG9mZnNldFggb2Zmc2V0WSBvcmlnaW5hbFRhcmdldCBwYWdlWCBwYWdlWSBwcmV2VmFsdWUgcmVsYXRlZE5vZGUgcmVsYXRlZFRhcmdldCBzY3JlZW5YIHNjcmVlblkgc2hpZnRLZXkgc3JjRWxlbWVudCB0YXJnZXQgdG9FbGVtZW50IHZpZXcgd2hlZWxEZWx0YSB3aGljaFwiLnNwbGl0KFwiIFwiKSxcblxuXHRmaXg6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIGV2ZW50WyBleHBhbmRvIF0gKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnQ7XG5cdFx0fVxuXG5cdFx0Ly8gc3RvcmUgYSBjb3B5IG9mIHRoZSBvcmlnaW5hbCBldmVudCBvYmplY3Rcblx0XHQvLyBhbmQgXCJjbG9uZVwiIHRvIHNldCByZWFkLW9ubHkgcHJvcGVydGllc1xuXHRcdHZhciBvcmlnaW5hbEV2ZW50ID0gZXZlbnQ7XG5cdFx0ZXZlbnQgPSBqUXVlcnkuRXZlbnQoIG9yaWdpbmFsRXZlbnQgKTtcblxuXHRcdGZvciAoIHZhciBpID0gdGhpcy5wcm9wcy5sZW5ndGgsIHByb3A7IGk7ICkge1xuXHRcdFx0cHJvcCA9IHRoaXMucHJvcHNbIC0taSBdO1xuXHRcdFx0ZXZlbnRbIHByb3AgXSA9IG9yaWdpbmFsRXZlbnRbIHByb3AgXTtcblx0XHR9XG5cblx0XHQvLyBGaXggdGFyZ2V0IHByb3BlcnR5LCBpZiBuZWNlc3Nhcnlcblx0XHRpZiAoICFldmVudC50YXJnZXQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQgPSBldmVudC5zcmNFbGVtZW50IHx8IGRvY3VtZW50OyAvLyBGaXhlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICMxOTI1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzcmNFbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBub3QgYmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWl0aGVyXG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgaWYgdGFyZ2V0IGlzIGEgdGV4dG5vZGUgKHNhZmFyaSlcblx0XHRpZiAoIGV2ZW50LnRhcmdldC5ub2RlVHlwZSA9PT0gMyApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdC8vIEFkZCByZWxhdGVkVGFyZ2V0LCBpZiBuZWNlc3Nhcnlcblx0XHRpZiAoICFldmVudC5yZWxhdGVkVGFyZ2V0ICYmIGV2ZW50LmZyb21FbGVtZW50ICkge1xuXHRcdFx0ZXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LmZyb21FbGVtZW50ID09PSBldmVudC50YXJnZXQgPyBldmVudC50b0VsZW1lbnQgOiBldmVudC5mcm9tRWxlbWVudDtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcGFnZVgvWSBpZiBtaXNzaW5nIGFuZCBjbGllbnRYL1kgYXZhaWxhYmxlXG5cdFx0aWYgKCBldmVudC5wYWdlWCA9PSBudWxsICYmIGV2ZW50LmNsaWVudFggIT0gbnVsbCApIHtcblx0XHRcdHZhciBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXHRcdFx0ZXZlbnQucGFnZVggPSBldmVudC5jbGllbnRYICsgKGRvYyAmJiBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsTGVmdCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudExlZnQgfHwgYm9keSAmJiBib2R5LmNsaWVudExlZnQgfHwgMCk7XG5cdFx0XHRldmVudC5wYWdlWSA9IGV2ZW50LmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wICB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wICB8fCAwKTtcblx0XHR9XG5cblx0XHQvLyBBZGQgd2hpY2ggZm9yIGtleSBldmVudHNcblx0XHRpZiAoICFldmVudC53aGljaCAmJiAoKGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmNoYXJDb2RlID09PSAwKSA/IGV2ZW50LmNoYXJDb2RlIDogZXZlbnQua2V5Q29kZSkgKSB7XG5cdFx0XHRldmVudC53aGljaCA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIG1ldGFLZXkgdG8gbm9uLU1hYyBicm93c2VycyAodXNlIGN0cmwgZm9yIFBDJ3MgYW5kIE1ldGFcbiAgICAgICAgICAgICAgICAvLyBmb3IgTWFjcylcblx0XHRpZiAoICFldmVudC5tZXRhS2V5ICYmIGV2ZW50LmN0cmxLZXkgKSB7XG5cdFx0XHRldmVudC5tZXRhS2V5ID0gZXZlbnQuY3RybEtleTtcblx0XHR9XG5cblx0XHQvLyBBZGQgd2hpY2ggZm9yIGNsaWNrOiAxID09PSBsZWZ0OyAyID09PSBtaWRkbGU7IDMgPT09IHJpZ2h0XG5cdFx0Ly8gTm90ZTogYnV0dG9uIGlzIG5vdCBub3JtYWxpemVkLCBzbyBkb24ndCB1c2UgaXRcblx0XHRpZiAoICFldmVudC53aGljaCAmJiBldmVudC5idXR0b24gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGV2ZW50LndoaWNoID0gKGV2ZW50LmJ1dHRvbiAmIDEgPyAxIDogKCBldmVudC5idXR0b24gJiAyID8gMyA6ICggZXZlbnQuYnV0dG9uICYgNCA/IDIgOiAwICkgKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV2ZW50O1xuXHR9LFxuXG5cdC8vIERlcHJlY2F0ZWQsIHVzZSBqUXVlcnkuZ3VpZCBpbnN0ZWFkXG5cdGd1aWQ6IDFFOCxcblxuXHQvLyBEZXByZWNhdGVkLCB1c2UgalF1ZXJ5LnByb3h5IGluc3RlYWRcblx0cHJveHk6IGpRdWVyeS5wcm94eSxcblxuXHRzcGVjaWFsOiB7XG5cdFx0cmVhZHk6IHtcblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGUgcmVhZHkgZXZlbnQgaXMgc2V0dXBcblx0XHRcdHNldHVwOiBqUXVlcnkuYmluZFJlYWR5LFxuXHRcdFx0dGVhcmRvd246IGpRdWVyeS5ub29wXG5cdFx0fSxcblxuXHRcdGxpdmU6IHtcblx0XHRcdGFkZDogZnVuY3Rpb24oIGhhbmRsZU9iaiApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgaGFuZGxlT2JqLm9yaWdUeXBlLCBqUXVlcnkuZXh0ZW5kKHt9LCBoYW5kbGVPYmosIHtoYW5kbGVyOiBsaXZlSGFuZGxlcn0pICk7IFxuXHRcdFx0fSxcblxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiggaGFuZGxlT2JqICkge1xuXHRcdFx0XHR2YXIgcmVtb3ZlID0gdHJ1ZSxcblx0XHRcdFx0XHR0eXBlID0gaGFuZGxlT2JqLm9yaWdUeXBlLnJlcGxhY2Uocm5hbWVzcGFjZXMsIFwiXCIpO1xuXHRcdFx0XHRcblx0XHRcdFx0alF1ZXJ5LmVhY2goIGpRdWVyeS5kYXRhKHRoaXMsIFwiZXZlbnRzXCIpLmxpdmUgfHwgW10sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggdHlwZSA9PT0gdGhpcy5vcmlnVHlwZS5yZXBsYWNlKHJuYW1lc3BhY2VzLCBcIlwiKSApIHtcblx0XHRcdFx0XHRcdHJlbW92ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKCByZW1vdmUgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggdGhpcywgaGFuZGxlT2JqLm9yaWdUeXBlLCBsaXZlSGFuZGxlciApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0YmVmb3JldW5sb2FkOiB7XG5cdFx0XHRzZXR1cDogZnVuY3Rpb24oIGRhdGEsIG5hbWVzcGFjZXMsIGV2ZW50SGFuZGxlICkge1xuXHRcdFx0XHQvLyBXZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBzcGVjaWFsIGNhc2Ugb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2luZG93c1xuXHRcdFx0XHRpZiAoIHRoaXMuc2V0SW50ZXJ2YWwgKSB7XG5cdFx0XHRcdFx0dGhpcy5vbmJlZm9yZXVubG9hZCA9IGV2ZW50SGFuZGxlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbiggbmFtZXNwYWNlcywgZXZlbnRIYW5kbGUgKSB7XG5cdFx0XHRcdGlmICggdGhpcy5vbmJlZm9yZXVubG9hZCA9PT0gZXZlbnRIYW5kbGUgKSB7XG5cdFx0XHRcdFx0dGhpcy5vbmJlZm9yZXVubG9hZCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbnZhciByZW1vdmVFdmVudCA9IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgP1xuXHRmdW5jdGlvbiggZWxlbSwgdHlwZSwgaGFuZGxlICkge1xuXHRcdGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgaGFuZGxlLCBmYWxzZSApO1xuXHR9IDogXG5cdGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCBoYW5kbGUgKSB7XG5cdFx0ZWxlbS5kZXRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgaGFuZGxlICk7XG5cdH07XG5cbmpRdWVyeS5FdmVudCA9IGZ1bmN0aW9uKCBzcmMgKSB7XG5cdC8vIEFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCB0aGUgJ25ldycga2V5d29yZFxuXHRpZiAoICF0aGlzLnByZXZlbnREZWZhdWx0ICkge1xuXHRcdHJldHVybiBuZXcgalF1ZXJ5LkV2ZW50KCBzcmMgKTtcblx0fVxuXG5cdC8vIEV2ZW50IG9iamVjdFxuXHRpZiAoIHNyYyAmJiBzcmMudHlwZSApIHtcblx0XHR0aGlzLm9yaWdpbmFsRXZlbnQgPSBzcmM7XG5cdFx0dGhpcy50eXBlID0gc3JjLnR5cGU7XG5cdC8vIEV2ZW50IHR5cGVcblx0fSBlbHNlIHtcblx0XHR0aGlzLnR5cGUgPSBzcmM7XG5cdH1cblxuXHQvLyB0aW1lU3RhbXAgaXMgYnVnZ3kgZm9yIHNvbWUgZXZlbnRzIG9uIEZpcmVmb3goIzM4NDMpXG5cdC8vIFNvIHdlIHdvbid0IHJlbHkgb24gdGhlIG5hdGl2ZSB2YWx1ZVxuXHR0aGlzLnRpbWVTdGFtcCA9IG5vdygpO1xuXG5cdC8vIE1hcmsgaXQgYXMgZml4ZWRcblx0dGhpc1sgZXhwYW5kbyBdID0gdHJ1ZTtcbn07XG5cbmZ1bmN0aW9uIHJldHVybkZhbHNlKCkge1xuXHRyZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuLy8galF1ZXJ5LkV2ZW50IGlzIGJhc2VkIG9uIERPTTMgRXZlbnRzIGFzIHNwZWNpZmllZCBieSB0aGUgRUNNQVNjcmlwdCBMYW5ndWFnZVxuLy8gQmluZGluZ1xuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMy9XRC1ET00tTGV2ZWwtMy1FdmVudHMtMjAwMzAzMzEvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG5qUXVlcnkuRXZlbnQucHJvdG90eXBlID0ge1xuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSByZXR1cm5UcnVlO1xuXG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cdFx0aWYgKCAhZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gaWYgcHJldmVudERlZmF1bHQgZXhpc3RzIHJ1biBpdCBvbiB0aGUgb3JpZ2luYWwgZXZlbnRcblx0XHRpZiAoIGUucHJldmVudERlZmF1bHQgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHRcdC8vIG90aGVyd2lzZSBzZXQgdGhlIHJldHVyblZhbHVlIHByb3BlcnR5IG9mIHRoZSBvcmlnaW5hbCBldmVudFxuICAgICAgICAgICAgICAgIC8vIHRvIGZhbHNlIChJRSlcblx0XHRlLnJldHVyblZhbHVlID0gZmFsc2U7XG5cdH0sXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cblx0XHR2YXIgZSA9IHRoaXMub3JpZ2luYWxFdmVudDtcblx0XHRpZiAoICFlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBpZiBzdG9wUHJvcGFnYXRpb24gZXhpc3RzIHJ1biBpdCBvbiB0aGUgb3JpZ2luYWwgZXZlbnRcblx0XHRpZiAoIGUuc3RvcFByb3BhZ2F0aW9uICkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdFx0Ly8gb3RoZXJ3aXNlIHNldCB0aGUgY2FuY2VsQnViYmxlIHByb3BlcnR5IG9mIHRoZSBvcmlnaW5hbCBldmVudFxuICAgICAgICAgICAgICAgIC8vIHRvIHRydWUgKElFKVxuXHRcdGUuY2FuY2VsQnViYmxlID0gdHJ1ZTtcblx0fSxcblx0c3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gcmV0dXJuVHJ1ZTtcblx0XHR0aGlzLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9LFxuXHRpc0RlZmF1bHRQcmV2ZW50ZWQ6IHJldHVybkZhbHNlLFxuXHRpc1Byb3BhZ2F0aW9uU3RvcHBlZDogcmV0dXJuRmFsc2UsXG5cdGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOiByZXR1cm5GYWxzZVxufTtcblxuLy8gQ2hlY2tzIGlmIGFuIGV2ZW50IGhhcHBlbmVkIG9uIGFuIGVsZW1lbnQgd2l0aGluIGFub3RoZXIgZWxlbWVudFxuLy8gVXNlZCBpbiBqUXVlcnkuZXZlbnQuc3BlY2lhbC5tb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlIGhhbmRsZXJzXG52YXIgd2l0aGluRWxlbWVudCA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0Ly8gQ2hlY2sgaWYgbW91c2Uob3ZlcnxvdXQpIGFyZSBzdGlsbCB3aXRoaW4gdGhlIHNhbWUgcGFyZW50IGVsZW1lbnRcblx0dmFyIHBhcmVudCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQ7XG5cblx0Ly8gRmlyZWZveCBzb21ldGltZXMgYXNzaWducyByZWxhdGVkVGFyZ2V0IGEgWFVMIGVsZW1lbnRcblx0Ly8gd2hpY2ggd2UgY2Fubm90IGFjY2VzcyB0aGUgcGFyZW50Tm9kZSBwcm9wZXJ0eSBvZlxuXHR0cnkge1xuXHRcdC8vIFRyYXZlcnNlIHVwIHRoZSB0cmVlXG5cdFx0d2hpbGUgKCBwYXJlbnQgJiYgcGFyZW50ICE9PSB0aGlzICkge1xuXHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwYXJlbnQgIT09IHRoaXMgKSB7XG5cdFx0XHQvLyBzZXQgdGhlIGNvcnJlY3QgZXZlbnQgdHlwZVxuXHRcdFx0ZXZlbnQudHlwZSA9IGV2ZW50LmRhdGE7XG5cblx0XHRcdC8vIGhhbmRsZSBldmVudCBpZiB3ZSBhY3R1YWxseSBqdXN0IG1vdXNlZCBvbiB0byBhIG5vblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3ViLWVsZW1lbnRcblx0XHRcdGpRdWVyeS5ldmVudC5oYW5kbGUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdH1cblxuXHQvLyBhc3N1bWluZyB3ZSd2ZSBsZWZ0IHRoZSBlbGVtZW50IHNpbmNlIHdlIG1vc3QgbGlrZWx5IG1vdXNlZG92ZXIgYSB4dWxcbiAgICAgICAgLy8gZWxlbWVudFxuXHR9IGNhdGNoKGUpIHsgfVxufSxcblxuLy8gSW4gY2FzZSBvZiBldmVudCBkZWxlZ2F0aW9uLCB3ZSBvbmx5IG5lZWQgdG8gcmVuYW1lIHRoZSBldmVudC50eXBlLFxuLy8gbGl2ZUhhbmRsZXIgd2lsbCB0YWtlIGNhcmUgb2YgdGhlIHJlc3QuXG5kZWxlZ2F0ZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0ZXZlbnQudHlwZSA9IGV2ZW50LmRhdGE7XG5cdGpRdWVyeS5ldmVudC5oYW5kbGUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xufTtcblxuLy8gQ3JlYXRlIG1vdXNlZW50ZXIgYW5kIG1vdXNlbGVhdmUgZXZlbnRzXG5qUXVlcnkuZWFjaCh7XG5cdG1vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsXG5cdG1vdXNlbGVhdmU6IFwibW91c2VvdXRcIlxufSwgZnVuY3Rpb24oIG9yaWcsIGZpeCApIHtcblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWxbIG9yaWcgXSA9IHtcblx0XHRzZXR1cDogZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCB0aGlzLCBmaXgsIGRhdGEgJiYgZGF0YS5zZWxlY3RvciA/IGRlbGVnYXRlIDogd2l0aGluRWxlbWVudCwgb3JpZyApO1xuXHRcdH0sXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggdGhpcywgZml4LCBkYXRhICYmIGRhdGEuc2VsZWN0b3IgPyBkZWxlZ2F0ZSA6IHdpdGhpbkVsZW1lbnQgKTtcblx0XHR9XG5cdH07XG59KTtcblxuLy8gc3VibWl0IGRlbGVnYXRpb25cbmlmICggIWpRdWVyeS5zdXBwb3J0LnN1Ym1pdEJ1YmJsZXMgKSB7XG5cblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWwuc3VibWl0ID0ge1xuXHRcdHNldHVwOiBmdW5jdGlvbiggZGF0YSwgbmFtZXNwYWNlcyApIHtcblx0XHRcdGlmICggdGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcImZvcm1cIiApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCh0aGlzLCBcImNsaWNrLnNwZWNpYWxTdWJtaXRcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0gPSBlLnRhcmdldCwgdHlwZSA9IGVsZW0udHlwZTtcblxuXHRcdFx0XHRcdGlmICggKHR5cGUgPT09IFwic3VibWl0XCIgfHwgdHlwZSA9PT0gXCJpbWFnZVwiKSAmJiBqUXVlcnkoIGVsZW0gKS5jbG9zZXN0KFwiZm9ybVwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJpZ2dlciggXCJzdWJtaXRcIiwgdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0IFxuXHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKHRoaXMsIFwia2V5cHJlc3Muc3BlY2lhbFN1Ym1pdFwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSA9IGUudGFyZ2V0LCB0eXBlID0gZWxlbS50eXBlO1xuXG5cdFx0XHRcdFx0aWYgKCAodHlwZSA9PT0gXCJ0ZXh0XCIgfHwgdHlwZSA9PT0gXCJwYXNzd29yZFwiKSAmJiBqUXVlcnkoIGVsZW0gKS5jbG9zZXN0KFwiZm9ybVwiKS5sZW5ndGggJiYgZS5rZXlDb2RlID09PSAxMyApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cmlnZ2VyKCBcInN1Ym1pdFwiLCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHRlYXJkb3duOiBmdW5jdGlvbiggbmFtZXNwYWNlcyApIHtcblx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIHRoaXMsIFwiLnNwZWNpYWxTdWJtaXRcIiApO1xuXHRcdH1cblx0fTtcblxufVxuXG4vLyBjaGFuZ2UgZGVsZWdhdGlvbiwgaGFwcGVucyBoZXJlIHNvIHdlIGhhdmUgYmluZC5cbmlmICggIWpRdWVyeS5zdXBwb3J0LmNoYW5nZUJ1YmJsZXMgKSB7XG5cblx0dmFyIGZvcm1FbGVtcyA9IC90ZXh0YXJlYXxpbnB1dHxzZWxlY3QvaSxcblxuXHRjaGFuZ2VGaWx0ZXJzLFxuXG5cdGdldFZhbCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciB0eXBlID0gZWxlbS50eXBlLCB2YWwgPSBlbGVtLnZhbHVlO1xuXG5cdFx0aWYgKCB0eXBlID09PSBcInJhZGlvXCIgfHwgdHlwZSA9PT0gXCJjaGVja2JveFwiICkge1xuXHRcdFx0dmFsID0gZWxlbS5jaGVja2VkO1xuXG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJzZWxlY3QtbXVsdGlwbGVcIiApIHtcblx0XHRcdHZhbCA9IGVsZW0uc2VsZWN0ZWRJbmRleCA+IC0xID9cblx0XHRcdFx0alF1ZXJ5Lm1hcCggZWxlbS5vcHRpb25zLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5zZWxlY3RlZDtcblx0XHRcdFx0fSkuam9pbihcIi1cIikgOlxuXHRcdFx0XHRcIlwiO1xuXG5cdFx0fSBlbHNlIGlmICggZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiICkge1xuXHRcdFx0dmFsID0gZWxlbS5zZWxlY3RlZEluZGV4O1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWw7XG5cdH0sXG5cblx0dGVzdENoYW5nZSA9IGZ1bmN0aW9uIHRlc3RDaGFuZ2UoIGUgKSB7XG5cdFx0dmFyIGVsZW0gPSBlLnRhcmdldCwgZGF0YSwgdmFsO1xuXG5cdFx0aWYgKCAhZm9ybUVsZW1zLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSB8fCBlbGVtLnJlYWRPbmx5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRhdGEgPSBqUXVlcnkuZGF0YSggZWxlbSwgXCJfY2hhbmdlX2RhdGFcIiApO1xuXHRcdHZhbCA9IGdldFZhbChlbGVtKTtcblxuXHRcdC8vIHRoZSBjdXJyZW50IGRhdGEgd2lsbCBiZSBhbHNvIHJldHJpZXZlZCBieSBiZWZvcmVhY3RpdmF0ZVxuXHRcdGlmICggZS50eXBlICE9PSBcImZvY3Vzb3V0XCIgfHwgZWxlbS50eXBlICE9PSBcInJhZGlvXCIgKSB7XG5cdFx0XHRqUXVlcnkuZGF0YSggZWxlbSwgXCJfY2hhbmdlX2RhdGFcIiwgdmFsICk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmICggZGF0YSA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gZGF0YSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIGRhdGEgIT0gbnVsbCB8fCB2YWwgKSB7XG5cdFx0XHRlLnR5cGUgPSBcImNoYW5nZVwiO1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5ldmVudC50cmlnZ2VyKCBlLCBhcmd1bWVudHNbMV0sIGVsZW0gKTtcblx0XHR9XG5cdH07XG5cblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWwuY2hhbmdlID0ge1xuXHRcdGZpbHRlcnM6IHtcblx0XHRcdGZvY3Vzb3V0OiB0ZXN0Q2hhbmdlLCBcblxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGUudGFyZ2V0LCB0eXBlID0gZWxlbS50eXBlO1xuXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gXCJyYWRpb1wiIHx8IHR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRlc3RDaGFuZ2UuY2FsbCggdGhpcywgZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBDaGFuZ2UgaGFzIHRvIGJlIGNhbGxlZCBiZWZvcmUgc3VibWl0XG5cdFx0XHQvLyBLZXlkb3duIHdpbGwgYmUgY2FsbGVkIGJlZm9yZSBrZXlwcmVzcywgd2hpY2ggaXMgdXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gc3VibWl0LWV2ZW50IGRlbGVnYXRpb25cblx0XHRcdGtleWRvd246IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGUudGFyZ2V0LCB0eXBlID0gZWxlbS50eXBlO1xuXG5cdFx0XHRcdGlmICggKGUua2V5Q29kZSA9PT0gMTMgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcInRleHRhcmVhXCIpIHx8XG5cdFx0XHRcdFx0KGUua2V5Q29kZSA9PT0gMzIgJiYgKHR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCB0eXBlID09PSBcInJhZGlvXCIpKSB8fFxuXHRcdFx0XHRcdHR5cGUgPT09IFwic2VsZWN0LW11bHRpcGxlXCIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRlc3RDaGFuZ2UuY2FsbCggdGhpcywgZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBCZWZvcmVhY3RpdmF0ZSBoYXBwZW5zIGFsc28gYmVmb3JlIHRoZSBwcmV2aW91c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpcyBibHVycmVkXG5cdFx0XHQvLyB3aXRoIHRoaXMgZXZlbnQgeW91IGNhbid0IHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnQsIGJ1dFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBzdG9yZVxuXHRcdFx0Ly8gaW5mb3JtYXRpb24vZm9jdXNbaW5dIGlzIG5vdCBuZWVkZWQgYW55bW9yZVxuXHRcdFx0YmVmb3JlYWN0aXZhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGUudGFyZ2V0O1xuXHRcdFx0XHRqUXVlcnkuZGF0YSggZWxlbSwgXCJfY2hhbmdlX2RhdGFcIiwgZ2V0VmFsKGVsZW0pICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNldHVwOiBmdW5jdGlvbiggZGF0YSwgbmFtZXNwYWNlcyApIHtcblx0XHRcdGlmICggdGhpcy50eXBlID09PSBcImZpbGVcIiApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCB2YXIgdHlwZSBpbiBjaGFuZ2VGaWx0ZXJzICkge1xuXHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCB0aGlzLCB0eXBlICsgXCIuc3BlY2lhbENoYW5nZVwiLCBjaGFuZ2VGaWx0ZXJzW3R5cGVdICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmb3JtRWxlbXMudGVzdCggdGhpcy5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHR0ZWFyZG93bjogZnVuY3Rpb24oIG5hbWVzcGFjZXMgKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCB0aGlzLCBcIi5zcGVjaWFsQ2hhbmdlXCIgKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1FbGVtcy50ZXN0KCB0aGlzLm5vZGVOYW1lICk7XG5cdFx0fVxuXHR9O1xuXG5cdGNoYW5nZUZpbHRlcnMgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbC5jaGFuZ2UuZmlsdGVycztcbn1cblxuZnVuY3Rpb24gdHJpZ2dlciggdHlwZSwgZWxlbSwgYXJncyApIHtcblx0YXJnc1swXS50eXBlID0gdHlwZTtcblx0cmV0dXJuIGpRdWVyeS5ldmVudC5oYW5kbGUuYXBwbHkoIGVsZW0sIGFyZ3MgKTtcbn1cblxuLy8gQ3JlYXRlIFwiYnViYmxpbmdcIiBmb2N1cyBhbmQgYmx1ciBldmVudHNcbmlmICggZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0alF1ZXJ5LmVhY2goeyBmb2N1czogXCJmb2N1c2luXCIsIGJsdXI6IFwiZm9jdXNvdXRcIiB9LCBmdW5jdGlvbiggb3JpZywgZml4ICkge1xuXHRcdGpRdWVyeS5ldmVudC5zcGVjaWFsWyBmaXggXSA9IHtcblx0XHRcdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCBvcmlnLCBoYW5kbGVyLCB0cnVlICk7XG5cdFx0XHR9LCBcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHsgXG5cdFx0XHRcdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggb3JpZywgaGFuZGxlciwgdHJ1ZSApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVyKCBlICkgeyBcblx0XHRcdGUgPSBqUXVlcnkuZXZlbnQuZml4KCBlICk7XG5cdFx0XHRlLnR5cGUgPSBmaXg7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LmV2ZW50LmhhbmRsZS5jYWxsKCB0aGlzLCBlICk7XG5cdFx0fVxuXHR9KTtcbn1cblxualF1ZXJ5LmVhY2goW1wiYmluZFwiLCBcIm9uZVwiXSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHR5cGUsIGRhdGEsIGZuICkge1xuXHRcdC8vIEhhbmRsZSBvYmplY3QgbGl0ZXJhbHNcblx0XHRpZiAoIHR5cGVvZiB0eXBlID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0Zm9yICggdmFyIGtleSBpbiB0eXBlICkge1xuXHRcdFx0XHR0aGlzWyBuYW1lIF0oa2V5LCBkYXRhLCB0eXBlW2tleV0sIGZuKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XG5cdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHZhciBoYW5kbGVyID0gbmFtZSA9PT0gXCJvbmVcIiA/IGpRdWVyeS5wcm94eSggZm4sIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnVuYmluZCggZXZlbnQsIGhhbmRsZXIgKTtcblx0XHRcdHJldHVybiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0fSkgOiBmbjtcblxuXHRcdGlmICggdHlwZSA9PT0gXCJ1bmxvYWRcIiAmJiBuYW1lICE9PSBcIm9uZVwiICkge1xuXHRcdFx0dGhpcy5vbmUoIHR5cGUsIGRhdGEsIGZuICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIHRoaXNbaV0sIHR5cGUsIGhhbmRsZXIsIGRhdGEgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcbn0pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0dW5iaW5kOiBmdW5jdGlvbiggdHlwZSwgZm4gKSB7XG5cdFx0Ly8gSGFuZGxlIG9iamVjdCBsaXRlcmFsc1xuXHRcdGlmICggdHlwZW9mIHR5cGUgPT09IFwib2JqZWN0XCIgJiYgIXR5cGUucHJldmVudERlZmF1bHQgKSB7XG5cdFx0XHRmb3IgKCB2YXIga2V5IGluIHR5cGUgKSB7XG5cdFx0XHRcdHRoaXMudW5iaW5kKGtleSwgdHlwZVtrZXldKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggdGhpc1tpXSwgdHlwZSwgZm4gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0XG5cdGRlbGVnYXRlOiBmdW5jdGlvbiggc2VsZWN0b3IsIHR5cGVzLCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gdGhpcy5saXZlKCB0eXBlcywgZGF0YSwgZm4sIHNlbGVjdG9yICk7XG5cdH0sXG5cdFxuXHR1bmRlbGVnYXRlOiBmdW5jdGlvbiggc2VsZWN0b3IsIHR5cGVzLCBmbiApIHtcblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnVuYmluZCggXCJsaXZlXCIgKTtcblx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGllKCB0eXBlcywgbnVsbCwgZm4sIHNlbGVjdG9yICk7XG5cdFx0fVxuXHR9LFxuXHRcblx0dHJpZ2dlcjogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCB0eXBlLCBkYXRhLCB0aGlzICk7XG5cdFx0fSk7XG5cdH0sXG5cblx0dHJpZ2dlckhhbmRsZXI6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdGlmICggdGhpc1swXSApIHtcblx0XHRcdHZhciBldmVudCA9IGpRdWVyeS5FdmVudCggdHlwZSApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIGV2ZW50LCBkYXRhLCB0aGlzWzBdICk7XG5cdFx0XHRyZXR1cm4gZXZlbnQucmVzdWx0O1xuXHRcdH1cblx0fSxcblxuXHR0b2dnbGU6IGZ1bmN0aW9uKCBmbiApIHtcblx0XHQvLyBTYXZlIHJlZmVyZW5jZSB0byBhcmd1bWVudHMgZm9yIGFjY2VzcyBpbiBjbG9zdXJlXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMsIGkgPSAxO1xuXG5cdFx0Ly8gbGluayBhbGwgdGhlIGZ1bmN0aW9ucywgc28gYW55IG9mIHRoZW0gY2FuIHVuYmluZCB0aGlzIGNsaWNrXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlclxuXHRcdHdoaWxlICggaSA8IGFyZ3MubGVuZ3RoICkge1xuXHRcdFx0alF1ZXJ5LnByb3h5KCBmbiwgYXJnc1sgaSsrIF0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5jbGljayggalF1ZXJ5LnByb3h5KCBmbiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0Ly8gRmlndXJlIG91dCB3aGljaCBmdW5jdGlvbiB0byBleGVjdXRlXG5cdFx0XHR2YXIgbGFzdFRvZ2dsZSA9ICggalF1ZXJ5LmRhdGEoIHRoaXMsIFwibGFzdFRvZ2dsZVwiICsgZm4uZ3VpZCApIHx8IDAgKSAlIGk7XG5cdFx0XHRqUXVlcnkuZGF0YSggdGhpcywgXCJsYXN0VG9nZ2xlXCIgKyBmbi5ndWlkLCBsYXN0VG9nZ2xlICsgMSApO1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBjbGlja3Mgc3RvcFxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Ly8gYW5kIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uXG5cdFx0XHRyZXR1cm4gYXJnc1sgbGFzdFRvZ2dsZSBdLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSB8fCBmYWxzZTtcblx0XHR9KSk7XG5cdH0sXG5cblx0aG92ZXI6IGZ1bmN0aW9uKCBmbk92ZXIsIGZuT3V0ICkge1xuXHRcdHJldHVybiB0aGlzLm1vdXNlZW50ZXIoIGZuT3ZlciApLm1vdXNlbGVhdmUoIGZuT3V0IHx8IGZuT3ZlciApO1xuXHR9XG59KTtcblxudmFyIGxpdmVNYXAgPSB7XG5cdGZvY3VzOiBcImZvY3VzaW5cIixcblx0Ymx1cjogXCJmb2N1c291dFwiLFxuXHRtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuXHRtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn07XG5cbmpRdWVyeS5lYWNoKFtcImxpdmVcIiwgXCJkaWVcIl0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCB0eXBlcywgZGF0YSwgZm4sIG9yaWdTZWxlY3RvciAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBJbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBVc2UgT25seVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi8gKSB7XG5cdFx0dmFyIHR5cGUsIGkgPSAwLCBtYXRjaCwgbmFtZXNwYWNlcywgcHJlVHlwZSxcblx0XHRcdHNlbGVjdG9yID0gb3JpZ1NlbGVjdG9yIHx8IHRoaXMuc2VsZWN0b3IsXG5cdFx0XHRjb250ZXh0ID0gb3JpZ1NlbGVjdG9yID8gdGhpcyA6IGpRdWVyeSggdGhpcy5jb250ZXh0ICk7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XG5cdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHR5cGVzID0gKHR5cGVzIHx8IFwiXCIpLnNwbGl0KFwiIFwiKTtcblxuXHRcdHdoaWxlICggKHR5cGUgPSB0eXBlc1sgaSsrIF0pICE9IG51bGwgKSB7XG5cdFx0XHRtYXRjaCA9IHJuYW1lc3BhY2VzLmV4ZWMoIHR5cGUgKTtcblx0XHRcdG5hbWVzcGFjZXMgPSBcIlwiO1xuXG5cdFx0XHRpZiAoIG1hdGNoICkgIHtcblx0XHRcdFx0bmFtZXNwYWNlcyA9IG1hdGNoWzBdO1xuXHRcdFx0XHR0eXBlID0gdHlwZS5yZXBsYWNlKCBybmFtZXNwYWNlcywgXCJcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiaG92ZXJcIiApIHtcblx0XHRcdFx0dHlwZXMucHVzaCggXCJtb3VzZWVudGVyXCIgKyBuYW1lc3BhY2VzLCBcIm1vdXNlbGVhdmVcIiArIG5hbWVzcGFjZXMgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHByZVR5cGUgPSB0eXBlO1xuXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiZm9jdXNcIiB8fCB0eXBlID09PSBcImJsdXJcIiApIHtcblx0XHRcdFx0dHlwZXMucHVzaCggbGl2ZU1hcFsgdHlwZSBdICsgbmFtZXNwYWNlcyApO1xuXHRcdFx0XHR0eXBlID0gdHlwZSArIG5hbWVzcGFjZXM7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHR5cGUgPSAobGl2ZU1hcFsgdHlwZSBdIHx8IHR5cGUpICsgbmFtZXNwYWNlcztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBuYW1lID09PSBcImxpdmVcIiApIHtcblx0XHRcdFx0Ly8gYmluZCBsaXZlIGhhbmRsZXJcblx0XHRcdFx0Y29udGV4dC5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgbGl2ZUNvbnZlcnQoIHR5cGUsIHNlbGVjdG9yICksXG5cdFx0XHRcdFx0XHR7IGRhdGE6IGRhdGEsIHNlbGVjdG9yOiBzZWxlY3RvciwgaGFuZGxlcjogZm4sIG9yaWdUeXBlOiB0eXBlLCBvcmlnSGFuZGxlcjogZm4sIHByZVR5cGU6IHByZVR5cGUgfSApO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdW5iaW5kIGxpdmUgaGFuZGxlclxuXHRcdFx0XHRjb250ZXh0LnVuYmluZCggbGl2ZUNvbnZlcnQoIHR5cGUsIHNlbGVjdG9yICksIGZuICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gbGl2ZUhhbmRsZXIoIGV2ZW50ICkge1xuXHR2YXIgc3RvcCwgZWxlbXMgPSBbXSwgc2VsZWN0b3JzID0gW10sIGFyZ3MgPSBhcmd1bWVudHMsXG5cdFx0cmVsYXRlZCwgbWF0Y2gsIGhhbmRsZU9iaiwgZWxlbSwgaiwgaSwgbCwgZGF0YSxcblx0XHRldmVudHMgPSBqUXVlcnkuZGF0YSggdGhpcywgXCJldmVudHNcIiApO1xuXG5cdC8vIE1ha2Ugc3VyZSB3ZSBhdm9pZCBub24tbGVmdC1jbGljayBidWJibGluZyBpbiBGaXJlZm94ICgjMzg2MSlcblx0aWYgKCBldmVudC5saXZlRmlyZWQgPT09IHRoaXMgfHwgIWV2ZW50cyB8fCAhZXZlbnRzLmxpdmUgfHwgZXZlbnQuYnV0dG9uICYmIGV2ZW50LnR5cGUgPT09IFwiY2xpY2tcIiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRldmVudC5saXZlRmlyZWQgPSB0aGlzO1xuXG5cdHZhciBsaXZlID0gZXZlbnRzLmxpdmUuc2xpY2UoMCk7XG5cblx0Zm9yICggaiA9IDA7IGogPCBsaXZlLmxlbmd0aDsgaisrICkge1xuXHRcdGhhbmRsZU9iaiA9IGxpdmVbal07XG5cblx0XHRpZiAoIGhhbmRsZU9iai5vcmlnVHlwZS5yZXBsYWNlKCBybmFtZXNwYWNlcywgXCJcIiApID09PSBldmVudC50eXBlICkge1xuXHRcdFx0c2VsZWN0b3JzLnB1c2goIGhhbmRsZU9iai5zZWxlY3RvciApO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGxpdmUuc3BsaWNlKCBqLS0sIDEgKTtcblx0XHR9XG5cdH1cblxuXHRtYXRjaCA9IGpRdWVyeSggZXZlbnQudGFyZ2V0ICkuY2xvc2VzdCggc2VsZWN0b3JzLCBldmVudC5jdXJyZW50VGFyZ2V0ICk7XG5cblx0Zm9yICggaSA9IDAsIGwgPSBtYXRjaC5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0Zm9yICggaiA9IDA7IGogPCBsaXZlLmxlbmd0aDsgaisrICkge1xuXHRcdFx0aGFuZGxlT2JqID0gbGl2ZVtqXTtcblxuXHRcdFx0aWYgKCBtYXRjaFtpXS5zZWxlY3RvciA9PT0gaGFuZGxlT2JqLnNlbGVjdG9yICkge1xuXHRcdFx0XHRlbGVtID0gbWF0Y2hbaV0uZWxlbTtcblx0XHRcdFx0cmVsYXRlZCA9IG51bGw7XG5cblx0XHRcdFx0Ly8gVGhvc2UgdHdvIGV2ZW50cyByZXF1aXJlIGFkZGl0aW9uYWwgY2hlY2tpbmdcblx0XHRcdFx0aWYgKCBoYW5kbGVPYmoucHJlVHlwZSA9PT0gXCJtb3VzZWVudGVyXCIgfHwgaGFuZGxlT2JqLnByZVR5cGUgPT09IFwibW91c2VsZWF2ZVwiICkge1xuXHRcdFx0XHRcdHJlbGF0ZWQgPSBqUXVlcnkoIGV2ZW50LnJlbGF0ZWRUYXJnZXQgKS5jbG9zZXN0KCBoYW5kbGVPYmouc2VsZWN0b3IgKVswXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggIXJlbGF0ZWQgfHwgcmVsYXRlZCAhPT0gZWxlbSApIHtcblx0XHRcdFx0XHRlbGVtcy5wdXNoKHsgZWxlbTogZWxlbSwgaGFuZGxlT2JqOiBoYW5kbGVPYmogfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmb3IgKCBpID0gMCwgbCA9IGVsZW1zLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRtYXRjaCA9IGVsZW1zW2ldO1xuXHRcdGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBtYXRjaC5lbGVtO1xuXHRcdGV2ZW50LmRhdGEgPSBtYXRjaC5oYW5kbGVPYmouZGF0YTtcblx0XHRldmVudC5oYW5kbGVPYmogPSBtYXRjaC5oYW5kbGVPYmo7XG5cblx0XHRpZiAoIG1hdGNoLmhhbmRsZU9iai5vcmlnSGFuZGxlci5hcHBseSggbWF0Y2guZWxlbSwgYXJncyApID09PSBmYWxzZSApIHtcblx0XHRcdHN0b3AgPSBmYWxzZTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzdG9wO1xufVxuXG5mdW5jdGlvbiBsaXZlQ29udmVydCggdHlwZSwgc2VsZWN0b3IgKSB7XG5cdHJldHVybiBcImxpdmUuXCIgKyAodHlwZSAmJiB0eXBlICE9PSBcIipcIiA/IHR5cGUgKyBcIi5cIiA6IFwiXCIpICsgc2VsZWN0b3IucmVwbGFjZSgvXFwuL2csIFwiYFwiKS5yZXBsYWNlKC8gL2csIFwiJlwiKTtcbn1cblxualF1ZXJ5LmVhY2goIChcImJsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrIFwiICtcblx0XCJtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZSBcIiArXG5cdFwiY2hhbmdlIHNlbGVjdCBzdWJtaXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBlcnJvclwiKS5zcGxpdChcIiBcIiksIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXG5cdC8vIEhhbmRsZSBldmVudCBiaW5kaW5nXG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIGZuICkge1xuXHRcdHJldHVybiBmbiA/IHRoaXMuYmluZCggbmFtZSwgZm4gKSA6IHRoaXMudHJpZ2dlciggbmFtZSApO1xuXHR9O1xuXG5cdGlmICggalF1ZXJ5LmF0dHJGbiApIHtcblx0XHRqUXVlcnkuYXR0ckZuWyBuYW1lIF0gPSB0cnVlO1xuXHR9XG59KTtcblxuLy8gUHJldmVudCBtZW1vcnkgbGVha3MgaW4gSUVcbi8vIFdpbmRvdyBpc24ndCBpbmNsdWRlZCBzbyBhcyBub3QgdG8gdW5iaW5kIGV4aXN0aW5nIHVubG9hZCBldmVudHNcbi8vIE1vcmUgaW5mbzpcbi8vIC0gaHR0cDovL2lzYWFjc2NobHVldGVyLmNvbS8yMDA2LzEwL21zaWUtbWVtb3J5LWxlYWtzL1xuaWYgKCB3aW5kb3cuYXR0YWNoRXZlbnQgJiYgIXdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHR3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbnVubG9hZFwiLCBmdW5jdGlvbigpIHtcblx0XHRmb3IgKCB2YXIgaWQgaW4galF1ZXJ5LmNhY2hlICkge1xuXHRcdFx0aWYgKCBqUXVlcnkuY2FjaGVbIGlkIF0uaGFuZGxlICkge1xuXHRcdFx0XHQvLyBUcnkvQ2F0Y2ggaXMgdG8gaGFuZGxlIGlmcmFtZXMgYmVpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5sb2FkZWQsIHNlZSAjNDI4MFxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIGpRdWVyeS5jYWNoZVsgaWQgXS5oYW5kbGUuZWxlbSApO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHt9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn1cbi8qXG4gKiAhIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIC0gdjEuMCBDb3B5cmlnaHQgMjAwOSwgVGhlIERvam8gRm91bmRhdGlvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCwgQlNELCBhbmQgR1BMIExpY2Vuc2VzLiBNb3JlIGluZm9ybWF0aW9uOlxuICogaHR0cDovL3NpenpsZWpzLmNvbS9cbiAqL1xuKGZ1bmN0aW9uKCl7XG5cbnZhciBjaHVua2VyID0gLygoPzpcXCgoPzpcXChbXigpXStcXCl8W14oKV0rKStcXCl8XFxbKD86XFxbW15bXFxdXSpcXF18WydcIl1bXidcIl0qWydcIl18W15bXFxdJ1wiXSspK1xcXXxcXFxcLnxbXiA+K34sKFxcW1xcXFxdKykrfFs+K35dKShcXHMqLFxccyopPygoPzoufFxccnxcXG4pKikvZyxcblx0ZG9uZSA9IDAsXG5cdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0aGFzRHVwbGljYXRlID0gZmFsc2UsXG5cdGJhc2VIYXNEdXBsaWNhdGUgPSB0cnVlO1xuXG4vLyBIZXJlIHdlIGNoZWNrIGlmIHRoZSBKYXZhU2NyaXB0IGVuZ2luZSBpcyB1c2luZyBzb21lIHNvcnQgb2Zcbi8vIG9wdGltaXphdGlvbiB3aGVyZSBpdCBkb2VzIG5vdCBhbHdheXMgY2FsbCBvdXIgY29tcGFyaXNpb25cbi8vIGZ1bmN0aW9uLiBJZiB0aGF0IGlzIHRoZSBjYXNlLCBkaXNjYXJkIHRoZSBoYXNEdXBsaWNhdGUgdmFsdWUuXG4vLyBUaHVzIGZhciB0aGF0IGluY2x1ZGVzIEdvb2dsZSBDaHJvbWUuXG5bMCwgMF0uc29ydChmdW5jdGlvbigpe1xuXHRiYXNlSGFzRHVwbGljYXRlID0gZmFsc2U7XG5cdHJldHVybiAwO1xufSk7XG5cbnZhciBTaXp6bGUgPSBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCkge1xuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblx0dmFyIG9yaWdDb250ZXh0ID0gY29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0aWYgKCBjb250ZXh0Lm5vZGVUeXBlICE9PSAxICYmIGNvbnRleHQubm9kZVR5cGUgIT09IDkgKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cdFxuXHRpZiAoICFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHR2YXIgcGFydHMgPSBbXSwgbSwgc2V0LCBjaGVja1NldCwgZXh0cmEsIHBydW5lID0gdHJ1ZSwgY29udGV4dFhNTCA9IGlzWE1MKGNvbnRleHQpLFxuXHRcdHNvRmFyID0gc2VsZWN0b3I7XG5cdFxuXHQvLyBSZXNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGNodW5rZXIgcmVnZXhwIChzdGFydCBmcm9tIGhlYWQpXG5cdHdoaWxlICggKGNodW5rZXIuZXhlYyhcIlwiKSwgbSA9IGNodW5rZXIuZXhlYyhzb0ZhcikpICE9PSBudWxsICkge1xuXHRcdHNvRmFyID0gbVszXTtcblx0XHRcblx0XHRwYXJ0cy5wdXNoKCBtWzFdICk7XG5cdFx0XG5cdFx0aWYgKCBtWzJdICkge1xuXHRcdFx0ZXh0cmEgPSBtWzNdO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCBwYXJ0cy5sZW5ndGggPiAxICYmIG9yaWdQT1MuZXhlYyggc2VsZWN0b3IgKSApIHtcblx0XHRpZiAoIHBhcnRzLmxlbmd0aCA9PT0gMiAmJiBFeHByLnJlbGF0aXZlWyBwYXJ0c1swXSBdICkge1xuXHRcdFx0c2V0ID0gcG9zUHJvY2VzcyggcGFydHNbMF0gKyBwYXJ0c1sxXSwgY29udGV4dCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXQgPSBFeHByLnJlbGF0aXZlWyBwYXJ0c1swXSBdID9cblx0XHRcdFx0WyBjb250ZXh0IF0gOlxuXHRcdFx0XHRTaXp6bGUoIHBhcnRzLnNoaWZ0KCksIGNvbnRleHQgKTtcblxuXHRcdFx0d2hpbGUgKCBwYXJ0cy5sZW5ndGggKSB7XG5cdFx0XHRcdHNlbGVjdG9yID0gcGFydHMuc2hpZnQoKTtcblxuXHRcdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbIHNlbGVjdG9yIF0gKSB7XG5cdFx0XHRcdFx0c2VsZWN0b3IgKz0gcGFydHMuc2hpZnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0c2V0ID0gcG9zUHJvY2Vzcyggc2VsZWN0b3IsIHNldCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBUYWtlIGEgc2hvcnRjdXQgYW5kIHNldCB0aGUgY29udGV4dCBpZiB0aGUgcm9vdCBzZWxlY3RvciBpc1xuICAgICAgICAgICAgICAgIC8vIGFuIElEXG5cdFx0Ly8gKGJ1dCBub3QgaWYgaXQnbGwgYmUgZmFzdGVyIGlmIHRoZSBpbm5lciBzZWxlY3RvciBpcyBhbiBJRClcblx0XHRpZiAoICFzZWVkICYmIHBhcnRzLmxlbmd0aCA+IDEgJiYgY29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiAhY29udGV4dFhNTCAmJlxuXHRcdFx0XHRFeHByLm1hdGNoLklELnRlc3QocGFydHNbMF0pICYmICFFeHByLm1hdGNoLklELnRlc3QocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pICkge1xuXHRcdFx0dmFyIHJldCA9IFNpenpsZS5maW5kKCBwYXJ0cy5zaGlmdCgpLCBjb250ZXh0LCBjb250ZXh0WE1MICk7XG5cdFx0XHRjb250ZXh0ID0gcmV0LmV4cHIgPyBTaXp6bGUuZmlsdGVyKCByZXQuZXhwciwgcmV0LnNldCApWzBdIDogcmV0LnNldFswXTtcblx0XHR9XG5cblx0XHRpZiAoIGNvbnRleHQgKSB7XG5cdFx0XHR2YXIgcmV0ID0gc2VlZCA/XG5cdFx0XHRcdHsgZXhwcjogcGFydHMucG9wKCksIHNldDogbWFrZUFycmF5KHNlZWQpIH0gOlxuXHRcdFx0XHRTaXp6bGUuZmluZCggcGFydHMucG9wKCksIHBhcnRzLmxlbmd0aCA9PT0gMSAmJiAocGFydHNbMF0gPT09IFwiflwiIHx8IHBhcnRzWzBdID09PSBcIitcIikgJiYgY29udGV4dC5wYXJlbnROb2RlID8gY29udGV4dC5wYXJlbnROb2RlIDogY29udGV4dCwgY29udGV4dFhNTCApO1xuXHRcdFx0c2V0ID0gcmV0LmV4cHIgPyBTaXp6bGUuZmlsdGVyKCByZXQuZXhwciwgcmV0LnNldCApIDogcmV0LnNldDtcblxuXHRcdFx0aWYgKCBwYXJ0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjaGVja1NldCA9IG1ha2VBcnJheShzZXQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJ1bmUgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0d2hpbGUgKCBwYXJ0cy5sZW5ndGggKSB7XG5cdFx0XHRcdHZhciBjdXIgPSBwYXJ0cy5wb3AoKSwgcG9wID0gY3VyO1xuXG5cdFx0XHRcdGlmICggIUV4cHIucmVsYXRpdmVbIGN1ciBdICkge1xuXHRcdFx0XHRcdGN1ciA9IFwiXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9wID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHBvcCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHBvcCA9IGNvbnRleHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRFeHByLnJlbGF0aXZlWyBjdXIgXSggY2hlY2tTZXQsIHBvcCwgY29udGV4dFhNTCApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaGVja1NldCA9IHBhcnRzID0gW107XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhY2hlY2tTZXQgKSB7XG5cdFx0Y2hlY2tTZXQgPSBzZXQ7XG5cdH1cblxuXHRpZiAoICFjaGVja1NldCApIHtcblx0XHRTaXp6bGUuZXJyb3IoIGN1ciB8fCBzZWxlY3RvciApO1xuXHR9XG5cblx0aWYgKCB0b1N0cmluZy5jYWxsKGNoZWNrU2V0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiICkge1xuXHRcdGlmICggIXBydW5lICkge1xuXHRcdFx0cmVzdWx0cy5wdXNoLmFwcGx5KCByZXN1bHRzLCBjaGVja1NldCApO1xuXHRcdH0gZWxzZSBpZiAoIGNvbnRleHQgJiYgY29udGV4dC5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdGZvciAoIHZhciBpID0gMDsgY2hlY2tTZXRbaV0gIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIGNoZWNrU2V0W2ldICYmIChjaGVja1NldFtpXSA9PT0gdHJ1ZSB8fCBjaGVja1NldFtpXS5ub2RlVHlwZSA9PT0gMSAmJiBjb250YWlucyhjb250ZXh0LCBjaGVja1NldFtpXSkpICkge1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaCggc2V0W2ldICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwOyBjaGVja1NldFtpXSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggY2hlY2tTZXRbaV0gJiYgY2hlY2tTZXRbaV0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBzZXRbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRtYWtlQXJyYXkoIGNoZWNrU2V0LCByZXN1bHRzICk7XG5cdH1cblxuXHRpZiAoIGV4dHJhICkge1xuXHRcdFNpenpsZSggZXh0cmEsIG9yaWdDb250ZXh0LCByZXN1bHRzLCBzZWVkICk7XG5cdFx0U2l6emxlLnVuaXF1ZVNvcnQoIHJlc3VsdHMgKTtcblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuU2l6emxlLnVuaXF1ZVNvcnQgPSBmdW5jdGlvbihyZXN1bHRzKXtcblx0aWYgKCBzb3J0T3JkZXIgKSB7XG5cdFx0aGFzRHVwbGljYXRlID0gYmFzZUhhc0R1cGxpY2F0ZTtcblx0XHRyZXN1bHRzLnNvcnQoc29ydE9yZGVyKTtcblxuXHRcdGlmICggaGFzRHVwbGljYXRlICkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAxOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCByZXN1bHRzW2ldID09PSByZXN1bHRzW2ktMV0gKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbihleHByLCBzZXQpe1xuXHRyZXR1cm4gU2l6emxlKGV4cHIsIG51bGwsIG51bGwsIHNldCk7XG59O1xuXG5TaXp6bGUuZmluZCA9IGZ1bmN0aW9uKGV4cHIsIGNvbnRleHQsIGlzWE1MKXtcblx0dmFyIHNldCwgbWF0Y2g7XG5cblx0aWYgKCAhZXhwciApIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBFeHByLm9yZGVyLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHR2YXIgdHlwZSA9IEV4cHIub3JkZXJbaV0sIG1hdGNoO1xuXHRcdFxuXHRcdGlmICggKG1hdGNoID0gRXhwci5sZWZ0TWF0Y2hbIHR5cGUgXS5leGVjKCBleHByICkpICkge1xuXHRcdFx0dmFyIGxlZnQgPSBtYXRjaFsxXTtcblx0XHRcdG1hdGNoLnNwbGljZSgxLDEpO1xuXG5cdFx0XHRpZiAoIGxlZnQuc3Vic3RyKCBsZWZ0Lmxlbmd0aCAtIDEgKSAhPT0gXCJcXFxcXCIgKSB7XG5cdFx0XHRcdG1hdGNoWzFdID0gKG1hdGNoWzFdIHx8IFwiXCIpLnJlcGxhY2UoL1xcXFwvZywgXCJcIik7XG5cdFx0XHRcdHNldCA9IEV4cHIuZmluZFsgdHlwZSBdKCBtYXRjaCwgY29udGV4dCwgaXNYTUwgKTtcblx0XHRcdFx0aWYgKCBzZXQgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRleHByID0gZXhwci5yZXBsYWNlKCBFeHByLm1hdGNoWyB0eXBlIF0sIFwiXCIgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICggIXNldCApIHtcblx0XHRzZXQgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKTtcblx0fVxuXG5cdHJldHVybiB7c2V0OiBzZXQsIGV4cHI6IGV4cHJ9O1xufTtcblxuU2l6emxlLmZpbHRlciA9IGZ1bmN0aW9uKGV4cHIsIHNldCwgaW5wbGFjZSwgbm90KXtcblx0dmFyIG9sZCA9IGV4cHIsIHJlc3VsdCA9IFtdLCBjdXJMb29wID0gc2V0LCBtYXRjaCwgYW55Rm91bmQsXG5cdFx0aXNYTUxGaWx0ZXIgPSBzZXQgJiYgc2V0WzBdICYmIGlzWE1MKHNldFswXSk7XG5cblx0d2hpbGUgKCBleHByICYmIHNldC5sZW5ndGggKSB7XG5cdFx0Zm9yICggdmFyIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoIChtYXRjaCA9IEV4cHIubGVmdE1hdGNoWyB0eXBlIF0uZXhlYyggZXhwciApKSAhPSBudWxsICYmIG1hdGNoWzJdICkge1xuXHRcdFx0XHR2YXIgZmlsdGVyID0gRXhwci5maWx0ZXJbIHR5cGUgXSwgZm91bmQsIGl0ZW0sIGxlZnQgPSBtYXRjaFsxXTtcblx0XHRcdFx0YW55Rm91bmQgPSBmYWxzZTtcblxuXHRcdFx0XHRtYXRjaC5zcGxpY2UoMSwxKTtcblxuXHRcdFx0XHRpZiAoIGxlZnQuc3Vic3RyKCBsZWZ0Lmxlbmd0aCAtIDEgKSA9PT0gXCJcXFxcXCIgKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGN1ckxvb3AgPT09IHJlc3VsdCApIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBbXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggRXhwci5wcmVGaWx0ZXJbIHR5cGUgXSApIHtcblx0XHRcdFx0XHRtYXRjaCA9IEV4cHIucHJlRmlsdGVyWyB0eXBlIF0oIG1hdGNoLCBjdXJMb29wLCBpbnBsYWNlLCByZXN1bHQsIG5vdCwgaXNYTUxGaWx0ZXIgKTtcblxuXHRcdFx0XHRcdGlmICggIW1hdGNoICkge1xuXHRcdFx0XHRcdFx0YW55Rm91bmQgPSBmb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2ggPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1hdGNoICkge1xuXHRcdFx0XHRcdGZvciAoIHZhciBpID0gMDsgKGl0ZW0gPSBjdXJMb29wW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGl0ZW0gKSB7XG5cdFx0XHRcdFx0XHRcdGZvdW5kID0gZmlsdGVyKCBpdGVtLCBtYXRjaCwgaSwgY3VyTG9vcCApO1xuXHRcdFx0XHRcdFx0XHR2YXIgcGFzcyA9IG5vdCBeICEhZm91bmQ7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCBpbnBsYWNlICYmIGZvdW5kICE9IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBwYXNzICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YW55Rm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJMb29wW2ldID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBwYXNzICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBpdGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0YW55Rm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmb3VuZCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGlmICggIWlucGxhY2UgKSB7XG5cdFx0XHRcdFx0XHRjdXJMb29wID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGV4cHIgPSBleHByLnJlcGxhY2UoIEV4cHIubWF0Y2hbIHR5cGUgXSwgXCJcIiApO1xuXG5cdFx0XHRcdFx0aWYgKCAhYW55Rm91bmQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJbXByb3BlciBleHByZXNzaW9uXG5cdFx0aWYgKCBleHByID09PSBvbGQgKSB7XG5cdFx0XHRpZiAoIGFueUZvdW5kID09IG51bGwgKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggZXhwciApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0b2xkID0gZXhwcjtcblx0fVxuXG5cdHJldHVybiBjdXJMb29wO1xufTtcblxuU2l6emxlLmVycm9yID0gZnVuY3Rpb24oIG1zZyApIHtcblx0dGhyb3cgXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZztcbn07XG5cbnZhciBFeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblx0b3JkZXI6IFsgXCJJRFwiLCBcIk5BTUVcIiwgXCJUQUdcIiBdLFxuXHRtYXRjaDoge1xuXHRcdElEOiAvIygoPzpbXFx3XFx1MDBjMC1cXHVGRkZGLV18XFxcXC4pKykvLFxuXHRcdENMQVNTOiAvXFwuKCg/OltcXHdcXHUwMGMwLVxcdUZGRkYtXXxcXFxcLikrKS8sXG5cdFx0TkFNRTogL1xcW25hbWU9WydcIl0qKCg/OltcXHdcXHUwMGMwLVxcdUZGRkYtXXxcXFxcLikrKVsnXCJdKlxcXS8sXG5cdFx0QVRUUjogL1xcW1xccyooKD86W1xcd1xcdTAwYzAtXFx1RkZGRi1dfFxcXFwuKSspXFxzKig/OihcXFM/PSlcXHMqKFsnXCJdKikoLio/KVxcM3wpXFxzKlxcXS8sXG5cdFx0VEFHOiAvXigoPzpbXFx3XFx1MDBjMC1cXHVGRkZGXFwqLV18XFxcXC4pKykvLFxuXHRcdENISUxEOiAvOihvbmx5fG50aHxsYXN0fGZpcnN0KS1jaGlsZCg/OlxcKChldmVufG9kZHxbXFxkbistXSopXFwpKT8vLFxuXHRcdFBPUzogLzoobnRofGVxfGd0fGx0fGZpcnN0fGxhc3R8ZXZlbnxvZGQpKD86XFwoKFxcZCopXFwpKT8oPz1bXi1dfCQpLyxcblx0XHRQU0VVRE86IC86KCg/OltcXHdcXHUwMGMwLVxcdUZGRkYtXXxcXFxcLikrKSg/OlxcKChbJ1wiXT8pKCg/OlxcKFteXFwpXStcXCl8W15cXChcXCldKikrKVxcMlxcKSk/L1xuXHR9LFxuXHRsZWZ0TWF0Y2g6IHt9LFxuXHRhdHRyTWFwOiB7XG5cdFx0XCJjbGFzc1wiOiBcImNsYXNzTmFtZVwiLFxuXHRcdFwiZm9yXCI6IFwiaHRtbEZvclwiXG5cdH0sXG5cdGF0dHJIYW5kbGU6IHtcblx0XHRocmVmOiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG5cdFx0fVxuXHR9LFxuXHRyZWxhdGl2ZToge1xuXHRcdFwiK1wiOiBmdW5jdGlvbihjaGVja1NldCwgcGFydCl7XG5cdFx0XHR2YXIgaXNQYXJ0U3RyID0gdHlwZW9mIHBhcnQgPT09IFwic3RyaW5nXCIsXG5cdFx0XHRcdGlzVGFnID0gaXNQYXJ0U3RyICYmICEvXFxXLy50ZXN0KHBhcnQpLFxuXHRcdFx0XHRpc1BhcnRTdHJOb3RUYWcgPSBpc1BhcnRTdHIgJiYgIWlzVGFnO1xuXG5cdFx0XHRpZiAoIGlzVGFnICkge1xuXHRcdFx0XHRwYXJ0ID0gcGFydC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBjaGVja1NldC5sZW5ndGgsIGVsZW07IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggKGVsZW0gPSBjaGVja1NldFtpXSkgKSB7XG5cdFx0XHRcdFx0d2hpbGUgKCAoZWxlbSA9IGVsZW0ucHJldmlvdXNTaWJsaW5nKSAmJiBlbGVtLm5vZGVUeXBlICE9PSAxICkge31cblxuXHRcdFx0XHRcdGNoZWNrU2V0W2ldID0gaXNQYXJ0U3RyTm90VGFnIHx8IGVsZW0gJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBwYXJ0ID9cblx0XHRcdFx0XHRcdGVsZW0gfHwgZmFsc2UgOlxuXHRcdFx0XHRcdFx0ZWxlbSA9PT0gcGFydDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzUGFydFN0ck5vdFRhZyApIHtcblx0XHRcdFx0U2l6emxlLmZpbHRlciggcGFydCwgY2hlY2tTZXQsIHRydWUgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiPlwiOiBmdW5jdGlvbihjaGVja1NldCwgcGFydCl7XG5cdFx0XHR2YXIgaXNQYXJ0U3RyID0gdHlwZW9mIHBhcnQgPT09IFwic3RyaW5nXCI7XG5cblx0XHRcdGlmICggaXNQYXJ0U3RyICYmICEvXFxXLy50ZXN0KHBhcnQpICkge1xuXHRcdFx0XHRwYXJ0ID0gcGFydC50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IGNoZWNrU2V0Lmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSA9IGNoZWNrU2V0W2ldO1xuXHRcdFx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdFx0XHRjaGVja1NldFtpXSA9IHBhcmVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBwYXJ0ID8gcGFyZW50IDogZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBjaGVja1NldC5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0gPSBjaGVja1NldFtpXTtcblx0XHRcdFx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRjaGVja1NldFtpXSA9IGlzUGFydFN0ciA/XG5cdFx0XHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZSA6XG5cdFx0XHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZSA9PT0gcGFydDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGlzUGFydFN0ciApIHtcblx0XHRcdFx0XHRTaXp6bGUuZmlsdGVyKCBwYXJ0LCBjaGVja1NldCwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcIlwiOiBmdW5jdGlvbihjaGVja1NldCwgcGFydCwgaXNYTUwpe1xuXHRcdFx0dmFyIGRvbmVOYW1lID0gZG9uZSsrLCBjaGVja0ZuID0gZGlyQ2hlY2s7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcnQgPT09IFwic3RyaW5nXCIgJiYgIS9cXFcvLnRlc3QocGFydCkgKSB7XG5cdFx0XHRcdHZhciBub2RlQ2hlY2sgPSBwYXJ0ID0gcGFydC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRjaGVja0ZuID0gZGlyTm9kZUNoZWNrO1xuXHRcdFx0fVxuXG5cdFx0XHRjaGVja0ZuKFwicGFyZW50Tm9kZVwiLCBwYXJ0LCBkb25lTmFtZSwgY2hlY2tTZXQsIG5vZGVDaGVjaywgaXNYTUwpO1xuXHRcdH0sXG5cdFx0XCJ+XCI6IGZ1bmN0aW9uKGNoZWNrU2V0LCBwYXJ0LCBpc1hNTCl7XG5cdFx0XHR2YXIgZG9uZU5hbWUgPSBkb25lKyssIGNoZWNrRm4gPSBkaXJDaGVjaztcblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFydCA9PT0gXCJzdHJpbmdcIiAmJiAhL1xcVy8udGVzdChwYXJ0KSApIHtcblx0XHRcdFx0dmFyIG5vZGVDaGVjayA9IHBhcnQgPSBwYXJ0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGNoZWNrRm4gPSBkaXJOb2RlQ2hlY2s7XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrRm4oXCJwcmV2aW91c1NpYmxpbmdcIiwgcGFydCwgZG9uZU5hbWUsIGNoZWNrU2V0LCBub2RlQ2hlY2ssIGlzWE1MKTtcblx0XHR9XG5cdH0sXG5cdGZpbmQ6IHtcblx0XHRJRDogZnVuY3Rpb24obWF0Y2gsIGNvbnRleHQsIGlzWE1MKXtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgIWlzWE1MICkge1xuXHRcdFx0XHR2YXIgbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQobWF0Y2hbMV0pO1xuXHRcdFx0XHRyZXR1cm4gbSA/IFttXSA6IFtdO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0TkFNRTogZnVuY3Rpb24obWF0Y2gsIGNvbnRleHQpe1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0dmFyIHJldCA9IFtdLCByZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZShtYXRjaFsxXSk7XG5cblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0aWYgKCByZXN1bHRzW2ldLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgPT09IG1hdGNoWzFdICkge1xuXHRcdFx0XHRcdFx0cmV0LnB1c2goIHJlc3VsdHNbaV0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmV0Lmxlbmd0aCA9PT0gMCA/IG51bGwgOiByZXQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRUQUc6IGZ1bmN0aW9uKG1hdGNoLCBjb250ZXh0KXtcblx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKG1hdGNoWzFdKTtcblx0XHR9XG5cdH0sXG5cdHByZUZpbHRlcjoge1xuXHRcdENMQVNTOiBmdW5jdGlvbihtYXRjaCwgY3VyTG9vcCwgaW5wbGFjZSwgcmVzdWx0LCBub3QsIGlzWE1MKXtcblx0XHRcdG1hdGNoID0gXCIgXCIgKyBtYXRjaFsxXS5yZXBsYWNlKC9cXFxcL2csIFwiXCIpICsgXCIgXCI7XG5cblx0XHRcdGlmICggaXNYTUwgKSB7XG5cdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBlbGVtOyAoZWxlbSA9IGN1ckxvb3BbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0XHRcdGlmICggbm90IF4gKGVsZW0uY2xhc3NOYW1lICYmIChcIiBcIiArIGVsZW0uY2xhc3NOYW1lICsgXCIgXCIpLnJlcGxhY2UoL1tcXHRcXG5dL2csIFwiIFwiKS5pbmRleE9mKG1hdGNoKSA+PSAwKSApIHtcblx0XHRcdFx0XHRcdGlmICggIWlucGxhY2UgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggaW5wbGFjZSApIHtcblx0XHRcdFx0XHRcdGN1ckxvb3BbaV0gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0SUQ6IGZ1bmN0aW9uKG1hdGNoKXtcblx0XHRcdHJldHVybiBtYXRjaFsxXS5yZXBsYWNlKC9cXFxcL2csIFwiXCIpO1xuXHRcdH0sXG5cdFx0VEFHOiBmdW5jdGlvbihtYXRjaCwgY3VyTG9vcCl7XG5cdFx0XHRyZXR1cm4gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKTtcblx0XHR9LFxuXHRcdENISUxEOiBmdW5jdGlvbihtYXRjaCl7XG5cdFx0XHRpZiAoIG1hdGNoWzFdID09PSBcIm50aFwiICkge1xuXHRcdFx0XHQvLyBwYXJzZSBlcXVhdGlvbnMgbGlrZSAnZXZlbicsICdvZGQnLCAnNScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICcybicsICczbisyJywgJzRuLTEnLCAnLW4rNidcblx0XHRcdFx0dmFyIHRlc3QgPSAvKC0/KShcXGQqKW4oKD86XFwrfC0pP1xcZCopLy5leGVjKFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSBcImV2ZW5cIiAmJiBcIjJuXCIgfHwgbWF0Y2hbMl0gPT09IFwib2RkXCIgJiYgXCIybisxXCIgfHxcblx0XHRcdFx0XHQhL1xcRC8udGVzdCggbWF0Y2hbMl0gKSAmJiBcIjBuK1wiICsgbWF0Y2hbMl0gfHwgbWF0Y2hbMl0pO1xuXG5cdFx0XHRcdC8vIGNhbGN1bGF0ZSB0aGUgbnVtYmVycyAoZmlyc3QpbisobGFzdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jbHVkaW5nIGlmIHRoZXkgYXJlIG5lZ2F0aXZlXG5cdFx0XHRcdG1hdGNoWzJdID0gKHRlc3RbMV0gKyAodGVzdFsyXSB8fCAxKSkgLSAwO1xuXHRcdFx0XHRtYXRjaFszXSA9IHRlc3RbM10gLSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBNb3ZlIHRvIG5vcm1hbCBjYWNoaW5nIHN5c3RlbVxuXHRcdFx0bWF0Y2hbMF0gPSBkb25lKys7XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9LFxuXHRcdEFUVFI6IGZ1bmN0aW9uKG1hdGNoLCBjdXJMb29wLCBpbnBsYWNlLCByZXN1bHQsIG5vdCwgaXNYTUwpe1xuXHRcdFx0dmFyIG5hbWUgPSBtYXRjaFsxXS5yZXBsYWNlKC9cXFxcL2csIFwiXCIpO1xuXHRcdFx0XG5cdFx0XHRpZiAoICFpc1hNTCAmJiBFeHByLmF0dHJNYXBbbmFtZV0gKSB7XG5cdFx0XHRcdG1hdGNoWzFdID0gRXhwci5hdHRyTWFwW25hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1hdGNoWzJdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWzRdID0gXCIgXCIgKyBtYXRjaFs0XSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblx0XHRQU0VVRE86IGZ1bmN0aW9uKG1hdGNoLCBjdXJMb29wLCBpbnBsYWNlLCByZXN1bHQsIG5vdCl7XG5cdFx0XHRpZiAoIG1hdGNoWzFdID09PSBcIm5vdFwiICkge1xuXHRcdFx0XHQvLyBJZiB3ZSdyZSBkZWFsaW5nIHdpdGggYSBjb21wbGV4IGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIGEgc2ltcGxlIG9uZVxuXHRcdFx0XHRpZiAoICggY2h1bmtlci5leGVjKG1hdGNoWzNdKSB8fCBcIlwiICkubGVuZ3RoID4gMSB8fCAvXlxcdy8udGVzdChtYXRjaFszXSkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hbM10gPSBTaXp6bGUobWF0Y2hbM10sIG51bGwsIG51bGwsIGN1ckxvb3ApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciByZXQgPSBTaXp6bGUuZmlsdGVyKG1hdGNoWzNdLCBjdXJMb29wLCBpbnBsYWNlLCB0cnVlIF4gbm90KTtcblx0XHRcdFx0XHRpZiAoICFpbnBsYWNlICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0LnB1c2guYXBwbHkoIHJlc3VsdCwgcmV0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggRXhwci5tYXRjaC5QT1MudGVzdCggbWF0Y2hbMF0gKSB8fCBFeHByLm1hdGNoLkNISUxELnRlc3QoIG1hdGNoWzBdICkgKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblx0XHRQT1M6IGZ1bmN0aW9uKG1hdGNoKXtcblx0XHRcdG1hdGNoLnVuc2hpZnQoIHRydWUgKTtcblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9XG5cdH0sXG5cdGZpbHRlcnM6IHtcblx0XHRlbmFibGVkOiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBmYWxzZSAmJiBlbGVtLnR5cGUgIT09IFwiaGlkZGVuXCI7XG5cdFx0fSxcblx0XHRkaXNhYmxlZDogZnVuY3Rpb24oZWxlbSl7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXHRcdGNoZWNrZWQ6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuIGVsZW0uY2hlY2tlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXHRcdHNlbGVjdGVkOiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblx0XHRwYXJlbnQ6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuICEhZWxlbS5maXJzdENoaWxkO1xuXHRcdH0sXG5cdFx0ZW1wdHk6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuICFlbGVtLmZpcnN0Q2hpbGQ7XG5cdFx0fSxcblx0XHRoYXM6IGZ1bmN0aW9uKGVsZW0sIGksIG1hdGNoKXtcblx0XHRcdHJldHVybiAhIVNpenpsZSggbWF0Y2hbM10sIGVsZW0gKS5sZW5ndGg7XG5cdFx0fSxcblx0XHRoZWFkZXI6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuIC9oXFxkL2kudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24oZWxlbSl7XG5cdFx0XHRyZXR1cm4gXCJ0ZXh0XCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdHJhZGlvOiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBcInJhZGlvXCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdGNoZWNrYm94OiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBcImNoZWNrYm94XCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdGZpbGU6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuIFwiZmlsZVwiID09PSBlbGVtLnR5cGU7XG5cdFx0fSxcblx0XHRwYXNzd29yZDogZnVuY3Rpb24oZWxlbSl7XG5cdFx0XHRyZXR1cm4gXCJwYXNzd29yZFwiID09PSBlbGVtLnR5cGU7XG5cdFx0fSxcblx0XHRzdWJtaXQ6IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuIFwic3VibWl0XCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdGltYWdlOiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBcImltYWdlXCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdHJlc2V0OiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiBcInJlc2V0XCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXHRcdGJ1dHRvbjogZnVuY3Rpb24oZWxlbSl7XG5cdFx0XHRyZXR1cm4gXCJidXR0b25cIiA9PT0gZWxlbS50eXBlIHx8IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJidXR0b25cIjtcblx0XHR9LFxuXHRcdGlucHV0OiBmdW5jdGlvbihlbGVtKXtcblx0XHRcdHJldHVybiAvaW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbi9pLnRlc3QoZWxlbS5ub2RlTmFtZSk7XG5cdFx0fVxuXHR9LFxuXHRzZXRGaWx0ZXJzOiB7XG5cdFx0Zmlyc3Q6IGZ1bmN0aW9uKGVsZW0sIGkpe1xuXHRcdFx0cmV0dXJuIGkgPT09IDA7XG5cdFx0fSxcblx0XHRsYXN0OiBmdW5jdGlvbihlbGVtLCBpLCBtYXRjaCwgYXJyYXkpe1xuXHRcdFx0cmV0dXJuIGkgPT09IGFycmF5Lmxlbmd0aCAtIDE7XG5cdFx0fSxcblx0XHRldmVuOiBmdW5jdGlvbihlbGVtLCBpKXtcblx0XHRcdHJldHVybiBpICUgMiA9PT0gMDtcblx0XHR9LFxuXHRcdG9kZDogZnVuY3Rpb24oZWxlbSwgaSl7XG5cdFx0XHRyZXR1cm4gaSAlIDIgPT09IDE7XG5cdFx0fSxcblx0XHRsdDogZnVuY3Rpb24oZWxlbSwgaSwgbWF0Y2gpe1xuXHRcdFx0cmV0dXJuIGkgPCBtYXRjaFszXSAtIDA7XG5cdFx0fSxcblx0XHRndDogZnVuY3Rpb24oZWxlbSwgaSwgbWF0Y2gpe1xuXHRcdFx0cmV0dXJuIGkgPiBtYXRjaFszXSAtIDA7XG5cdFx0fSxcblx0XHRudGg6IGZ1bmN0aW9uKGVsZW0sIGksIG1hdGNoKXtcblx0XHRcdHJldHVybiBtYXRjaFszXSAtIDAgPT09IGk7XG5cdFx0fSxcblx0XHRlcTogZnVuY3Rpb24oZWxlbSwgaSwgbWF0Y2gpe1xuXHRcdFx0cmV0dXJuIG1hdGNoWzNdIC0gMCA9PT0gaTtcblx0XHR9XG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdFBTRVVETzogZnVuY3Rpb24oZWxlbSwgbWF0Y2gsIGksIGFycmF5KXtcblx0XHRcdHZhciBuYW1lID0gbWF0Y2hbMV0sIGZpbHRlciA9IEV4cHIuZmlsdGVyc1sgbmFtZSBdO1xuXG5cdFx0XHRpZiAoIGZpbHRlciApIHtcblx0XHRcdFx0cmV0dXJuIGZpbHRlciggZWxlbSwgaSwgbWF0Y2gsIGFycmF5ICk7XG5cdFx0XHR9IGVsc2UgaWYgKCBuYW1lID09PSBcImNvbnRhaW5zXCIgKSB7XG5cdFx0XHRcdHJldHVybiAoZWxlbS50ZXh0Q29udGVudCB8fCBlbGVtLmlubmVyVGV4dCB8fCBnZXRUZXh0KFsgZWxlbSBdKSB8fCBcIlwiKS5pbmRleE9mKG1hdGNoWzNdKSA+PSAwO1xuXHRcdFx0fSBlbHNlIGlmICggbmFtZSA9PT0gXCJub3RcIiApIHtcblx0XHRcdFx0dmFyIG5vdCA9IG1hdGNoWzNdO1xuXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IG5vdC5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBub3RbaV0gPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIgKyBuYW1lICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRDSElMRDogZnVuY3Rpb24oZWxlbSwgbWF0Y2gpe1xuXHRcdFx0dmFyIHR5cGUgPSBtYXRjaFsxXSwgbm9kZSA9IGVsZW07XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnb25seSc6XG5cdFx0XHRcdGNhc2UgJ2ZpcnN0Jzpcblx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmcpIClcdCB7XG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgKSB7IFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7IFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIHR5cGUgPT09IFwiZmlyc3RcIiApIHsgXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRjYXNlICdsYXN0Jzpcblx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gbm9kZS5uZXh0U2libGluZykgKVx0IHtcblx0XHRcdFx0XHRcdGlmICggbm9kZS5ub2RlVHlwZSA9PT0gMSApIHsgXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTsgXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRjYXNlICdudGgnOlxuXHRcdFx0XHRcdHZhciBmaXJzdCA9IG1hdGNoWzJdLCBsYXN0ID0gbWF0Y2hbM107XG5cblx0XHRcdFx0XHRpZiAoIGZpcnN0ID09PSAxICYmIGxhc3QgPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIGRvbmVOYW1lID0gbWF0Y2hbMF0sXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFxuXHRcdFx0XHRcdGlmICggcGFyZW50ICYmIChwYXJlbnQuc2l6Y2FjaGUgIT09IGRvbmVOYW1lIHx8ICFlbGVtLm5vZGVJbmRleCkgKSB7XG5cdFx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0XHRcdFx0Zm9yICggbm9kZSA9IHBhcmVudC5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZUluZGV4ID0gKytjb3VudDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRcdHBhcmVudC5zaXpjYWNoZSA9IGRvbmVOYW1lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgZGlmZiA9IGVsZW0ubm9kZUluZGV4IC0gbGFzdDtcblx0XHRcdFx0XHRpZiAoIGZpcnN0ID09PSAwICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRpZmYgPT09IDA7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAoIGRpZmYgJSBmaXJzdCA9PT0gMCAmJiBkaWZmIC8gZmlyc3QgPj0gMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdElEOiBmdW5jdGlvbihlbGVtLCBtYXRjaCl7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBtYXRjaDtcblx0XHR9LFxuXHRcdFRBRzogZnVuY3Rpb24oZWxlbSwgbWF0Y2gpe1xuXHRcdFx0cmV0dXJuIChtYXRjaCA9PT0gXCIqXCIgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSkgfHwgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBtYXRjaDtcblx0XHR9LFxuXHRcdENMQVNTOiBmdW5jdGlvbihlbGVtLCBtYXRjaCl7XG5cdFx0XHRyZXR1cm4gKFwiIFwiICsgKGVsZW0uY2xhc3NOYW1lIHx8IGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpICsgXCIgXCIpXG5cdFx0XHRcdC5pbmRleE9mKCBtYXRjaCApID4gLTE7XG5cdFx0fSxcblx0XHRBVFRSOiBmdW5jdGlvbihlbGVtLCBtYXRjaCl7XG5cdFx0XHR2YXIgbmFtZSA9IG1hdGNoWzFdLFxuXHRcdFx0XHRyZXN1bHQgPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUgXSA/XG5cdFx0XHRcdFx0RXhwci5hdHRySGFuZGxlWyBuYW1lIF0oIGVsZW0gKSA6XG5cdFx0XHRcdFx0ZWxlbVsgbmFtZSBdICE9IG51bGwgP1xuXHRcdFx0XHRcdFx0ZWxlbVsgbmFtZSBdIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICksXG5cdFx0XHRcdHZhbHVlID0gcmVzdWx0ICsgXCJcIixcblx0XHRcdFx0dHlwZSA9IG1hdGNoWzJdLFxuXHRcdFx0XHRjaGVjayA9IG1hdGNoWzRdO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0ID09IG51bGwgP1xuXHRcdFx0XHR0eXBlID09PSBcIiE9XCIgOlxuXHRcdFx0XHR0eXBlID09PSBcIj1cIiA/XG5cdFx0XHRcdHZhbHVlID09PSBjaGVjayA6XG5cdFx0XHRcdHR5cGUgPT09IFwiKj1cIiA/XG5cdFx0XHRcdHZhbHVlLmluZGV4T2YoY2hlY2spID49IDAgOlxuXHRcdFx0XHR0eXBlID09PSBcIn49XCIgP1xuXHRcdFx0XHQoXCIgXCIgKyB2YWx1ZSArIFwiIFwiKS5pbmRleE9mKGNoZWNrKSA+PSAwIDpcblx0XHRcdFx0IWNoZWNrID9cblx0XHRcdFx0dmFsdWUgJiYgcmVzdWx0ICE9PSBmYWxzZSA6XG5cdFx0XHRcdHR5cGUgPT09IFwiIT1cIiA/XG5cdFx0XHRcdHZhbHVlICE9PSBjaGVjayA6XG5cdFx0XHRcdHR5cGUgPT09IFwiXj1cIiA/XG5cdFx0XHRcdHZhbHVlLmluZGV4T2YoY2hlY2spID09PSAwIDpcblx0XHRcdFx0dHlwZSA9PT0gXCIkPVwiID9cblx0XHRcdFx0dmFsdWUuc3Vic3RyKHZhbHVlLmxlbmd0aCAtIGNoZWNrLmxlbmd0aCkgPT09IGNoZWNrIDpcblx0XHRcdFx0dHlwZSA9PT0gXCJ8PVwiID9cblx0XHRcdFx0dmFsdWUgPT09IGNoZWNrIHx8IHZhbHVlLnN1YnN0cigwLCBjaGVjay5sZW5ndGggKyAxKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdGZhbHNlO1xuXHRcdH0sXG5cdFx0UE9TOiBmdW5jdGlvbihlbGVtLCBtYXRjaCwgaSwgYXJyYXkpe1xuXHRcdFx0dmFyIG5hbWUgPSBtYXRjaFsyXSwgZmlsdGVyID0gRXhwci5zZXRGaWx0ZXJzWyBuYW1lIF07XG5cblx0XHRcdGlmICggZmlsdGVyICkge1xuXHRcdFx0XHRyZXR1cm4gZmlsdGVyKCBlbGVtLCBpLCBtYXRjaCwgYXJyYXkgKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbnZhciBvcmlnUE9TID0gRXhwci5tYXRjaC5QT1M7XG5cbmZvciAoIHZhciB0eXBlIGluIEV4cHIubWF0Y2ggKSB7XG5cdEV4cHIubWF0Y2hbIHR5cGUgXSA9IG5ldyBSZWdFeHAoIEV4cHIubWF0Y2hbIHR5cGUgXS5zb3VyY2UgKyAvKD8hW15cXFtdKlxcXSkoPyFbXlxcKF0qXFwpKS8uc291cmNlICk7XG5cdEV4cHIubGVmdE1hdGNoWyB0eXBlIF0gPSBuZXcgUmVnRXhwKCAvKF4oPzoufFxccnxcXG4pKj8pLy5zb3VyY2UgKyBFeHByLm1hdGNoWyB0eXBlIF0uc291cmNlLnJlcGxhY2UoL1xcXFwoXFxkKykvZywgZnVuY3Rpb24oYWxsLCBudW0pe1xuXHRcdHJldHVybiBcIlxcXFxcIiArIChudW0gLSAwICsgMSk7XG5cdH0pKTtcbn1cblxudmFyIG1ha2VBcnJheSA9IGZ1bmN0aW9uKGFycmF5LCByZXN1bHRzKSB7XG5cdGFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFycmF5LCAwICk7XG5cblx0aWYgKCByZXN1bHRzICkge1xuXHRcdHJlc3VsdHMucHVzaC5hcHBseSggcmVzdWx0cywgYXJyYXkgKTtcblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXHRcblx0cmV0dXJuIGFycmF5O1xufTtcblxuLy8gUGVyZm9ybSBhIHNpbXBsZSBjaGVjayB0byBkZXRlcm1pbmUgaWYgdGhlIGJyb3dzZXIgaXMgY2FwYWJsZSBvZlxuLy8gY29udmVydGluZyBhIE5vZGVMaXN0IHRvIGFuIGFycmF5IHVzaW5nIGJ1aWx0aW4gbWV0aG9kcy5cbi8vIEFsc28gdmVyaWZpZXMgdGhhdCB0aGUgcmV0dXJuZWQgYXJyYXkgaG9sZHMgRE9NIG5vZGVzXG4vLyAod2hpY2ggaXMgbm90IHRoZSBjYXNlIGluIHRoZSBCbGFja2JlcnJ5IGJyb3dzZXIpXG50cnkge1xuXHRBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXMsIDAgKVswXS5ub2RlVHlwZTtcblxuLy8gUHJvdmlkZSBhIGZhbGxiYWNrIG1ldGhvZCBpZiBpdCBkb2VzIG5vdCB3b3JrXG59IGNhdGNoKGUpe1xuXHRtYWtlQXJyYXkgPSBmdW5jdGlvbihhcnJheSwgcmVzdWx0cykge1xuXHRcdHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG5cdFx0aWYgKCB0b1N0cmluZy5jYWxsKGFycmF5KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiICkge1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoIHJldCwgYXJyYXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCB0eXBlb2YgYXJyYXkubGVuZ3RoID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0cmV0LnB1c2goIGFycmF5W2ldICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoIHZhciBpID0gMDsgYXJyYXlbaV07IGkrKyApIHtcblx0XHRcdFx0XHRyZXQucHVzaCggYXJyYXlbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH07XG59XG5cbnZhciBzb3J0T3JkZXI7XG5cbmlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICkge1xuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoICFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIHx8ICFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICkge1xuXHRcdFx0aWYgKCBhID09IGIgKSB7XG5cdFx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IC0xIDogMTtcblx0XHR9XG5cblx0XHR2YXIgcmV0ID0gYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSAmIDQgPyAtMSA6IGEgPT09IGIgPyAwIDogMTtcblx0XHRpZiAoIHJldCA9PT0gMCApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiByZXQ7XG5cdH07XG59IGVsc2UgaWYgKCBcInNvdXJjZUluZGV4XCIgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoICFhLnNvdXJjZUluZGV4IHx8ICFiLnNvdXJjZUluZGV4ICkge1xuXHRcdFx0aWYgKCBhID09IGIgKSB7XG5cdFx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5zb3VyY2VJbmRleCA/IC0xIDogMTtcblx0XHR9XG5cblx0XHR2YXIgcmV0ID0gYS5zb3VyY2VJbmRleCAtIGIuc291cmNlSW5kZXg7XG5cdFx0aWYgKCByZXQgPT09IDAgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gcmV0O1xuXHR9O1xufSBlbHNlIGlmICggZG9jdW1lbnQuY3JlYXRlUmFuZ2UgKSB7XG5cdHNvcnRPcmRlciA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdGlmICggIWEub3duZXJEb2N1bWVudCB8fCAhYi5vd25lckRvY3VtZW50ICkge1xuXHRcdFx0aWYgKCBhID09IGIgKSB7XG5cdFx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5vd25lckRvY3VtZW50ID8gLTEgOiAxO1xuXHRcdH1cblxuXHRcdHZhciBhUmFuZ2UgPSBhLm93bmVyRG9jdW1lbnQuY3JlYXRlUmFuZ2UoKSwgYlJhbmdlID0gYi5vd25lckRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG5cdFx0YVJhbmdlLnNldFN0YXJ0KGEsIDApO1xuXHRcdGFSYW5nZS5zZXRFbmQoYSwgMCk7XG5cdFx0YlJhbmdlLnNldFN0YXJ0KGIsIDApO1xuXHRcdGJSYW5nZS5zZXRFbmQoYiwgMCk7XG5cdFx0dmFyIHJldCA9IGFSYW5nZS5jb21wYXJlQm91bmRhcnlQb2ludHMoUmFuZ2UuU1RBUlRfVE9fRU5ELCBiUmFuZ2UpO1xuXHRcdGlmICggcmV0ID09PSAwICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIHJldDtcblx0fTtcbn1cblxuLy8gVXRpbGl0eSBmdW5jdGlvbiBmb3IgcmV0cmVpdmluZyB0aGUgdGV4dCB2YWx1ZSBvZiBhbiBhcnJheSBvZiBET00gbm9kZXNcbmZ1bmN0aW9uIGdldFRleHQoIGVsZW1zICkge1xuXHR2YXIgcmV0ID0gXCJcIiwgZWxlbTtcblxuXHRmb3IgKCB2YXIgaSA9IDA7IGVsZW1zW2ldOyBpKysgKSB7XG5cdFx0ZWxlbSA9IGVsZW1zW2ldO1xuXG5cdFx0Ly8gR2V0IHRoZSB0ZXh0IGZyb20gdGV4dCBub2RlcyBhbmQgQ0RBVEEgbm9kZXNcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gNCApIHtcblx0XHRcdHJldCArPSBlbGVtLm5vZGVWYWx1ZTtcblxuXHRcdC8vIFRyYXZlcnNlIGV2ZXJ5dGhpbmcgZWxzZSwgZXhjZXB0IGNvbW1lbnQgbm9kZXNcblx0XHR9IGVsc2UgaWYgKCBlbGVtLm5vZGVUeXBlICE9PSA4ICkge1xuXHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0uY2hpbGROb2RlcyApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXQ7XG59XG5cbi8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnJvd3NlciByZXR1cm5zIGVsZW1lbnRzIGJ5IG5hbWUgd2hlblxuLy8gcXVlcnlpbmcgYnkgZ2V0RWxlbWVudEJ5SWQgKGFuZCBwcm92aWRlIGEgd29ya2Fyb3VuZClcbihmdW5jdGlvbigpe1xuXHQvLyBXZSdyZSBnb2luZyB0byBpbmplY3QgYSBmYWtlIGlucHV0IGVsZW1lbnQgd2l0aCBhIHNwZWNpZmllZCBuYW1lXG5cdHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRpZCA9IFwic2NyaXB0XCIgKyAobmV3IERhdGUpLmdldFRpbWUoKTtcblx0Zm9ybS5pbm5lckhUTUwgPSBcIjxhIG5hbWU9J1wiICsgaWQgKyBcIicvPlwiO1xuXG5cdC8vIEluamVjdCBpdCBpbnRvIHRoZSByb290IGVsZW1lbnQsIGNoZWNrIGl0cyBzdGF0dXMsIGFuZCByZW1vdmUgaXRcbiAgICAgICAgLy8gcXVpY2tseVxuXHR2YXIgcm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0cm9vdC5pbnNlcnRCZWZvcmUoIGZvcm0sIHJvb3QuZmlyc3RDaGlsZCApO1xuXG5cdC8vIFRoZSB3b3JrYXJvdW5kIGhhcyB0byBkbyBhZGRpdGlvbmFsIGNoZWNrcyBhZnRlciBhIGdldEVsZW1lbnRCeUlkXG5cdC8vIFdoaWNoIHNsb3dzIHRoaW5ncyBkb3duIGZvciBvdGhlciBicm93c2VycyAoaGVuY2UgdGhlIGJyYW5jaGluZylcblx0aWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWQgKSApIHtcblx0XHRFeHByLmZpbmQuSUQgPSBmdW5jdGlvbihtYXRjaCwgY29udGV4dCwgaXNYTUwpe1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNYTUwgKSB7XG5cdFx0XHRcdHZhciBtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZChtYXRjaFsxXSk7XG5cdFx0XHRcdHJldHVybiBtID8gbS5pZCA9PT0gbWF0Y2hbMV0gfHwgdHlwZW9mIG0uZ2V0QXR0cmlidXRlTm9kZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKS5ub2RlVmFsdWUgPT09IG1hdGNoWzFdID8gW21dIDogdW5kZWZpbmVkIDogW107XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdEV4cHIuZmlsdGVyLklEID0gZnVuY3Rpb24oZWxlbSwgbWF0Y2gpe1xuXHRcdFx0dmFyIG5vZGUgPSB0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlICE9PSBcInVuZGVmaW5lZFwiICYmIGVsZW0uZ2V0QXR0cmlidXRlTm9kZShcImlkXCIpO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgbm9kZSAmJiBub2RlLm5vZGVWYWx1ZSA9PT0gbWF0Y2g7XG5cdFx0fTtcblx0fVxuXG5cdHJvb3QucmVtb3ZlQ2hpbGQoIGZvcm0gKTtcblx0cm9vdCA9IGZvcm0gPSBudWxsOyAvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxufSkoKTtcblxuKGZ1bmN0aW9uKCl7XG5cdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnJvd3NlciByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0Ly8gd2hlbiBkb2luZyBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIilcblxuXHQvLyBDcmVhdGUgYSBmYWtlIGVsZW1lbnRcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGRpdi5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIlwiKSApO1xuXG5cdC8vIE1ha2Ugc3VyZSBubyBjb21tZW50cyBhcmUgZm91bmRcblx0aWYgKCBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLmxlbmd0aCA+IDAgKSB7XG5cdFx0RXhwci5maW5kLlRBRyA9IGZ1bmN0aW9uKG1hdGNoLCBjb250ZXh0KXtcblx0XHRcdHZhciByZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZShtYXRjaFsxXSk7XG5cblx0XHRcdC8vIEZpbHRlciBvdXQgcG9zc2libGUgY29tbWVudHNcblx0XHRcdGlmICggbWF0Y2hbMV0gPT09IFwiKlwiICkge1xuXHRcdFx0XHR2YXIgdG1wID0gW107XG5cblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwOyByZXN1bHRzW2ldOyBpKysgKSB7XG5cdFx0XHRcdFx0aWYgKCByZXN1bHRzW2ldLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0dG1wLnB1c2goIHJlc3VsdHNbaV0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHRzID0gdG1wO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXHR9XG5cblx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGFuIGF0dHJpYnV0ZSByZXR1cm5zIG5vcm1hbGl6ZWQgaHJlZiBhdHRyaWJ1dGVzXG5cdGRpdi5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0aWYgKCBkaXYuZmlyc3RDaGlsZCAmJiB0eXBlb2YgZGl2LmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRkaXYuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpICE9PSBcIiNcIiApIHtcblx0XHRFeHByLmF0dHJIYW5kbGUuaHJlZiA9IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwiaHJlZlwiLCAyKTtcblx0XHR9O1xuXHR9XG5cblx0ZGl2ID0gbnVsbDsgLy8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcbn0pKCk7XG5cbmlmICggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCApIHtcblx0KGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG9sZFNpenpsZSA9IFNpenpsZSwgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gXCI8cCBjbGFzcz0nVEVTVCc+PC9wPlwiO1xuXG5cdFx0Ly8gU2FmYXJpIGNhbid0IGhhbmRsZSB1cHBlcmNhc2Ugb3IgdW5pY29kZSBjaGFyYWN0ZXJzIHdoZW5cblx0XHQvLyBpbiBxdWlya3MgbW9kZS5cblx0XHRpZiAoIGRpdi5xdWVyeVNlbGVjdG9yQWxsICYmIGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiLlRFU1RcIikubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XG5cdFx0U2l6emxlID0gZnVuY3Rpb24ocXVlcnksIGNvbnRleHQsIGV4dHJhLCBzZWVkKXtcblx0XHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0XHQvLyBPbmx5IHVzZSBxdWVyeVNlbGVjdG9yQWxsIG9uIG5vbi1YTUwgZG9jdW1lbnRzXG5cdFx0XHQvLyAoSUQgc2VsZWN0b3JzIGRvbid0IHdvcmsgaW4gbm9uLUhUTUwgZG9jdW1lbnRzKVxuXHRcdFx0aWYgKCAhc2VlZCAmJiBjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmICFpc1hNTChjb250ZXh0KSApIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXR1cm4gbWFrZUFycmF5KCBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLCBleHRyYSApO1xuXHRcdFx0XHR9IGNhdGNoKGUpe31cblx0XHRcdH1cblx0XHRcblx0XHRcdHJldHVybiBvbGRTaXp6bGUocXVlcnksIGNvbnRleHQsIGV4dHJhLCBzZWVkKTtcblx0XHR9O1xuXG5cdFx0Zm9yICggdmFyIHByb3AgaW4gb2xkU2l6emxlICkge1xuXHRcdFx0U2l6emxlWyBwcm9wIF0gPSBvbGRTaXp6bGVbIHByb3AgXTtcblx0XHR9XG5cblx0XHRkaXYgPSBudWxsOyAvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHR9KSgpO1xufVxuXG4oZnVuY3Rpb24oKXtcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0ZGl2LmlubmVySFRNTCA9IFwiPGRpdiBjbGFzcz0ndGVzdCBlJz48L2Rpdj48ZGl2IGNsYXNzPSd0ZXN0Jz48L2Rpdj5cIjtcblxuXHQvLyBPcGVyYSBjYW4ndCBmaW5kIGEgc2Vjb25kIGNsYXNzbmFtZSAoaW4gOS42KVxuXHQvLyBBbHNvLCBtYWtlIHN1cmUgdGhhdCBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIGFjdHVhbGx5IGV4aXN0c1xuXHRpZiAoICFkaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSB8fCBkaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImVcIikubGVuZ3RoID09PSAwICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFNhZmFyaSBjYWNoZXMgY2xhc3MgYXR0cmlidXRlcywgZG9lc24ndCBjYXRjaCBjaGFuZ2VzIChpbiAzLjIpXG5cdGRpdi5sYXN0Q2hpbGQuY2xhc3NOYW1lID0gXCJlXCI7XG5cblx0aWYgKCBkaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImVcIikubGVuZ3RoID09PSAxICkge1xuXHRcdHJldHVybjtcblx0fVxuXHRcblx0RXhwci5vcmRlci5zcGxpY2UoMSwgMCwgXCJDTEFTU1wiKTtcblx0RXhwci5maW5kLkNMQVNTID0gZnVuY3Rpb24obWF0Y2gsIGNvbnRleHQsIGlzWE1MKSB7XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUobWF0Y2hbMV0pO1xuXHRcdH1cblx0fTtcblxuXHRkaXYgPSBudWxsOyAvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxufSkoKTtcblxuZnVuY3Rpb24gZGlyTm9kZUNoZWNrKCBkaXIsIGN1ciwgZG9uZU5hbWUsIGNoZWNrU2V0LCBub2RlQ2hlY2ssIGlzWE1MICkge1xuXHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBjaGVja1NldC5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0dmFyIGVsZW0gPSBjaGVja1NldFtpXTtcblx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRlbGVtID0gZWxlbVtkaXJdO1xuXHRcdFx0dmFyIG1hdGNoID0gZmFsc2U7XG5cblx0XHRcdHdoaWxlICggZWxlbSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLnNpemNhY2hlID09PSBkb25lTmFtZSApIHtcblx0XHRcdFx0XHRtYXRjaCA9IGNoZWNrU2V0W2VsZW0uc2l6c2V0XTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiAhaXNYTUwgKXtcblx0XHRcdFx0XHRlbGVtLnNpemNhY2hlID0gZG9uZU5hbWU7XG5cdFx0XHRcdFx0ZWxlbS5zaXpzZXQgPSBpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGN1ciApIHtcblx0XHRcdFx0XHRtYXRjaCA9IGVsZW07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtID0gZWxlbVtkaXJdO1xuXHRcdFx0fVxuXG5cdFx0XHRjaGVja1NldFtpXSA9IG1hdGNoO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBkaXJDaGVjayggZGlyLCBjdXIsIGRvbmVOYW1lLCBjaGVja1NldCwgbm9kZUNoZWNrLCBpc1hNTCApIHtcblx0Zm9yICggdmFyIGkgPSAwLCBsID0gY2hlY2tTZXQubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdHZhciBlbGVtID0gY2hlY2tTZXRbaV07XG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0ZWxlbSA9IGVsZW1bZGlyXTtcblx0XHRcdHZhciBtYXRjaCA9IGZhbHNlO1xuXG5cdFx0XHR3aGlsZSAoIGVsZW0gKSB7XG5cdFx0XHRcdGlmICggZWxlbS5zaXpjYWNoZSA9PT0gZG9uZU5hbWUgKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBjaGVja1NldFtlbGVtLnNpenNldF07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRcdFx0XHRlbGVtLnNpemNhY2hlID0gZG9uZU5hbWU7XG5cdFx0XHRcdFx0XHRlbGVtLnNpenNldCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggdHlwZW9mIGN1ciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRcdGlmICggZWxlbSA9PT0gY3VyICkge1xuXHRcdFx0XHRcdFx0XHRtYXRjaCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggU2l6emxlLmZpbHRlciggY3VyLCBbZWxlbV0gKS5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0bWF0Y2ggPSBlbGVtO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbSA9IGVsZW1bZGlyXTtcblx0XHRcdH1cblxuXHRcdFx0Y2hlY2tTZXRbaV0gPSBtYXRjaDtcblx0XHR9XG5cdH1cbn1cblxudmFyIGNvbnRhaW5zID0gZG9jdW1lbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24gPyBmdW5jdGlvbihhLCBiKXtcblx0cmV0dXJuICEhKGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYikgJiAxNik7XG59IDogZnVuY3Rpb24oYSwgYil7XG5cdHJldHVybiBhICE9PSBiICYmIChhLmNvbnRhaW5zID8gYS5jb250YWlucyhiKSA6IHRydWUpO1xufTtcblxudmFyIGlzWE1MID0gZnVuY3Rpb24oZWxlbSl7XG5cdC8vIGRvY3VtZW50RWxlbWVudCBpcyB2ZXJpZmllZCBmb3IgY2FzZXMgd2hlcmUgaXQgZG9lc24ndCB5ZXQgZXhpc3Rcblx0Ly8gKHN1Y2ggYXMgbG9hZGluZyBpZnJhbWVzIGluIElFIC0gIzQ4MzMpXG5cdHZhciBkb2N1bWVudEVsZW1lbnQgPSAoZWxlbSA/IGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtIDogMCkuZG9jdW1lbnRFbGVtZW50O1xuXHRyZXR1cm4gZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lICE9PSBcIkhUTUxcIiA6IGZhbHNlO1xufTtcblxudmFyIHBvc1Byb2Nlc3MgPSBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCl7XG5cdHZhciB0bXBTZXQgPSBbXSwgbGF0ZXIgPSBcIlwiLCBtYXRjaCxcblx0XHRyb290ID0gY29udGV4dC5ub2RlVHlwZSA/IFtjb250ZXh0XSA6IGNvbnRleHQ7XG5cblx0Ly8gUG9zaXRpb24gc2VsZWN0b3JzIG11c3QgYmUgZG9uZSBhZnRlciB0aGUgZmlsdGVyXG5cdC8vIEFuZCBzbyBtdXN0IDpub3QocG9zaXRpb25hbCkgc28gd2UgbW92ZSBhbGwgUFNFVURPcyB0byB0aGUgZW5kXG5cdHdoaWxlICggKG1hdGNoID0gRXhwci5tYXRjaC5QU0VVRE8uZXhlYyggc2VsZWN0b3IgKSkgKSB7XG5cdFx0bGF0ZXIgKz0gbWF0Y2hbMF07XG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKCBFeHByLm1hdGNoLlBTRVVETywgXCJcIiApO1xuXHR9XG5cblx0c2VsZWN0b3IgPSBFeHByLnJlbGF0aXZlW3NlbGVjdG9yXSA/IHNlbGVjdG9yICsgXCIqXCIgOiBzZWxlY3RvcjtcblxuXHRmb3IgKCB2YXIgaSA9IDAsIGwgPSByb290Lmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRTaXp6bGUoIHNlbGVjdG9yLCByb290W2ldLCB0bXBTZXQgKTtcblx0fVxuXG5cdHJldHVybiBTaXp6bGUuZmlsdGVyKCBsYXRlciwgdG1wU2V0ICk7XG59O1xuXG4vLyBFWFBPU0VcbmpRdWVyeS5maW5kID0gU2l6emxlO1xualF1ZXJ5LmV4cHIgPSBTaXp6bGUuc2VsZWN0b3JzO1xualF1ZXJ5LmV4cHJbXCI6XCJdID0galF1ZXJ5LmV4cHIuZmlsdGVycztcbmpRdWVyeS51bmlxdWUgPSBTaXp6bGUudW5pcXVlU29ydDtcbmpRdWVyeS50ZXh0ID0gZ2V0VGV4dDtcbmpRdWVyeS5pc1hNTERvYyA9IGlzWE1MO1xualF1ZXJ5LmNvbnRhaW5zID0gY29udGFpbnM7XG5cbnJldHVybjtcblxud2luZG93LlNpenpsZSA9IFNpenpsZTtcblxufSkoKTtcbnZhciBydW50aWwgPSAvVW50aWwkLyxcblx0cnBhcmVudHNwcmV2ID0gL14oPzpwYXJlbnRzfHByZXZVbnRpbHxwcmV2QWxsKS8sXG5cdC8vIE5vdGU6IFRoaXMgUmVnRXhwIHNob3VsZCBiZSBpbXByb3ZlZCwgb3IgbGlrZWx5IHB1bGxlZCBmcm9tIFNpenpsZVxuXHRybXVsdGlzZWxlY3RvciA9IC8sLyxcblx0c2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8vIEltcGxlbWVudCB0aGUgaWRlbnRpY2FsIGZ1bmN0aW9uYWxpdHkgZm9yIGZpbHRlciBhbmQgbm90XG52YXIgd2lubm93ID0gZnVuY3Rpb24oIGVsZW1lbnRzLCBxdWFsaWZpZXIsIGtlZXAgKSB7XG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHF1YWxpZmllciApICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcChlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHRyZXR1cm4gISFxdWFsaWZpZXIuY2FsbCggZWxlbSwgaSwgZWxlbSApID09PSBrZWVwO1xuXHRcdH0pO1xuXG5cdH0gZWxzZSBpZiAoIHF1YWxpZmllci5ub2RlVHlwZSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdyZXAoZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtLCBpICkge1xuXHRcdFx0cmV0dXJuIChlbGVtID09PSBxdWFsaWZpZXIpID09PSBrZWVwO1xuXHRcdH0pO1xuXG5cdH0gZWxzZSBpZiAoIHR5cGVvZiBxdWFsaWZpZXIgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0dmFyIGZpbHRlcmVkID0galF1ZXJ5LmdyZXAoZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZVR5cGUgPT09IDE7XG5cdFx0fSk7XG5cblx0XHRpZiAoIGlzU2ltcGxlLnRlc3QoIHF1YWxpZmllciApICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5maWx0ZXIocXVhbGlmaWVyLCBmaWx0ZXJlZCwgIWtlZXApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWFsaWZpZXIgPSBqUXVlcnkuZmlsdGVyKCBxdWFsaWZpZXIsIGZpbHRlcmVkICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGpRdWVyeS5ncmVwKGVsZW1lbnRzLCBmdW5jdGlvbiggZWxlbSwgaSApIHtcblx0XHRyZXR1cm4gKGpRdWVyeS5pbkFycmF5KCBlbGVtLCBxdWFsaWZpZXIgKSA+PSAwKSA9PT0ga2VlcDtcblx0fSk7XG59O1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0ZmluZDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciByZXQgPSB0aGlzLnB1c2hTdGFjayggXCJcIiwgXCJmaW5kXCIsIHNlbGVjdG9yICksIGxlbmd0aCA9IDA7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdGxlbmd0aCA9IHJldC5sZW5ndGg7XG5cdFx0XHRqUXVlcnkuZmluZCggc2VsZWN0b3IsIHRoaXNbaV0sIHJldCApO1xuXG5cdFx0XHRpZiAoIGkgPiAwICkge1xuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcmVzdWx0cyBhcmUgdW5pcXVlXG5cdFx0XHRcdGZvciAoIHZhciBuID0gbGVuZ3RoOyBuIDwgcmV0Lmxlbmd0aDsgbisrICkge1xuXHRcdFx0XHRcdGZvciAoIHZhciByID0gMDsgciA8IGxlbmd0aDsgcisrICkge1xuXHRcdFx0XHRcdFx0aWYgKCByZXRbcl0gPT09IHJldFtuXSApIHtcblx0XHRcdFx0XHRcdFx0cmV0LnNwbGljZShuLS0sIDEpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGhhczogZnVuY3Rpb24oIHRhcmdldCApIHtcblx0XHR2YXIgdGFyZ2V0cyA9IGpRdWVyeSggdGFyZ2V0ICk7XG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGFyZ2V0cy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggalF1ZXJ5LmNvbnRhaW5zKCB0aGlzLCB0YXJnZXRzW2ldICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRub3Q6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHdpbm5vdyh0aGlzLCBzZWxlY3RvciwgZmFsc2UpLCBcIm5vdFwiLCBzZWxlY3Rvcik7XG5cdH0sXG5cblx0ZmlsdGVyOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCB3aW5ub3codGhpcywgc2VsZWN0b3IsIHRydWUpLCBcImZpbHRlclwiLCBzZWxlY3RvciApO1xuXHR9LFxuXHRcblx0aXM6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gISFzZWxlY3RvciAmJiBqUXVlcnkuZmlsdGVyKCBzZWxlY3RvciwgdGhpcyApLmxlbmd0aCA+IDA7XG5cdH0sXG5cblx0Y2xvc2VzdDogZnVuY3Rpb24oIHNlbGVjdG9ycywgY29udGV4dCApIHtcblx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCBzZWxlY3RvcnMgKSApIHtcblx0XHRcdHZhciByZXQgPSBbXSwgY3VyID0gdGhpc1swXSwgbWF0Y2gsIG1hdGNoZXMgPSB7fSwgc2VsZWN0b3I7XG5cblx0XHRcdGlmICggY3VyICYmIHNlbGVjdG9ycy5sZW5ndGggKSB7XG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IHNlbGVjdG9ycy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3RvcnNbaV07XG5cblx0XHRcdFx0XHRpZiAoICFtYXRjaGVzW3NlbGVjdG9yXSApIHtcblx0XHRcdFx0XHRcdG1hdGNoZXNbc2VsZWN0b3JdID0galF1ZXJ5LmV4cHIubWF0Y2guUE9TLnRlc3QoIHNlbGVjdG9yICkgPyBcblx0XHRcdFx0XHRcdFx0alF1ZXJ5KCBzZWxlY3RvciwgY29udGV4dCB8fCB0aGlzLmNvbnRleHQgKSA6XG5cdFx0XHRcdFx0XHRcdHNlbGVjdG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHdoaWxlICggY3VyICYmIGN1ci5vd25lckRvY3VtZW50ICYmIGN1ciAhPT0gY29udGV4dCApIHtcblx0XHRcdFx0XHRmb3IgKCBzZWxlY3RvciBpbiBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0bWF0Y2ggPSBtYXRjaGVzW3NlbGVjdG9yXTtcblxuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaC5qcXVlcnkgPyBtYXRjaC5pbmRleChjdXIpID4gLTEgOiBqUXVlcnkoY3VyKS5pcyhtYXRjaCkgKSB7XG5cdFx0XHRcdFx0XHRcdHJldC5wdXNoKHsgc2VsZWN0b3I6IHNlbGVjdG9yLCBlbGVtOiBjdXIgfSk7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBtYXRjaGVzW3NlbGVjdG9yXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VyID0gY3VyLnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cblx0XHR2YXIgcG9zID0galF1ZXJ5LmV4cHIubWF0Y2guUE9TLnRlc3QoIHNlbGVjdG9ycyApID8gXG5cdFx0XHRqUXVlcnkoIHNlbGVjdG9ycywgY29udGV4dCB8fCB0aGlzLmNvbnRleHQgKSA6IG51bGw7XG5cblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oIGksIGN1ciApIHtcblx0XHRcdHdoaWxlICggY3VyICYmIGN1ci5vd25lckRvY3VtZW50ICYmIGN1ciAhPT0gY29udGV4dCApIHtcblx0XHRcdFx0aWYgKCBwb3MgPyBwb3MuaW5kZXgoY3VyKSA+IC0xIDogalF1ZXJ5KGN1cikuaXMoc2VsZWN0b3JzKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gY3VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1ciA9IGN1ci5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH0sXG5cdFxuXHQvLyBEZXRlcm1pbmUgdGhlIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgd2l0aGluXG5cdC8vIHRoZSBtYXRjaGVkIHNldCBvZiBlbGVtZW50c1xuXHRpbmRleDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0aWYgKCAhZWxlbSB8fCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuaW5BcnJheSggdGhpc1swXSxcblx0XHRcdFx0Ly8gSWYgaXQgcmVjZWl2ZXMgYSBzdHJpbmcsIHRoZSBzZWxlY3RvciBpcyB1c2VkXG5cdFx0XHRcdC8vIElmIGl0IHJlY2VpdmVzIG5vdGhpbmcsIHRoZSBzaWJsaW5ncyBhcmUgdXNlZFxuXHRcdFx0XHRlbGVtID8galF1ZXJ5KCBlbGVtICkgOiB0aGlzLnBhcmVudCgpLmNoaWxkcmVuKCkgKTtcblx0XHR9XG5cdFx0Ly8gTG9jYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZGVzaXJlZCBlbGVtZW50XG5cdFx0cmV0dXJuIGpRdWVyeS5pbkFycmF5KFxuXHRcdFx0Ly8gSWYgaXQgcmVjZWl2ZXMgYSBqUXVlcnkgb2JqZWN0LCB0aGUgZmlyc3QgZWxlbWVudCBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlZFxuXHRcdFx0ZWxlbS5qcXVlcnkgPyBlbGVtWzBdIDogZWxlbSwgdGhpcyApO1xuXHR9LFxuXG5cdGFkZDogZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0ICkge1xuXHRcdHZhciBzZXQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgP1xuXHRcdFx0XHRqUXVlcnkoIHNlbGVjdG9yLCBjb250ZXh0IHx8IHRoaXMuY29udGV4dCApIDpcblx0XHRcdFx0alF1ZXJ5Lm1ha2VBcnJheSggc2VsZWN0b3IgKSxcblx0XHRcdGFsbCA9IGpRdWVyeS5tZXJnZSggdGhpcy5nZXQoKSwgc2V0ICk7XG5cblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGlzRGlzY29ubmVjdGVkKCBzZXRbMF0gKSB8fCBpc0Rpc2Nvbm5lY3RlZCggYWxsWzBdICkgP1xuXHRcdFx0YWxsIDpcblx0XHRcdGpRdWVyeS51bmlxdWUoIGFsbCApICk7XG5cdH0sXG5cblx0YW5kU2VsZjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWRkKCB0aGlzLnByZXZPYmplY3QgKTtcblx0fVxufSk7XG5cbi8vIEEgcGFpbmZ1bGx5IHNpbXBsZSBjaGVjayB0byBzZWUgaWYgYW4gZWxlbWVudCBpcyBkaXNjb25uZWN0ZWRcbi8vIGZyb20gYSBkb2N1bWVudCAoc2hvdWxkIGJlIGltcHJvdmVkLCB3aGVyZSBmZWFzaWJsZSkuXG5mdW5jdGlvbiBpc0Rpc2Nvbm5lY3RlZCggbm9kZSApIHtcblx0cmV0dXJuICFub2RlIHx8ICFub2RlLnBhcmVudE5vZGUgfHwgbm9kZS5wYXJlbnROb2RlLm5vZGVUeXBlID09PSAxMTtcbn1cblxualF1ZXJ5LmVhY2goe1xuXHRwYXJlbnQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFx0cmV0dXJuIHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgIT09IDExID8gcGFyZW50IDogbnVsbDtcblx0fSxcblx0cGFyZW50czogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwicGFyZW50Tm9kZVwiICk7XG5cdH0sXG5cdHBhcmVudHNVbnRpbDogZnVuY3Rpb24oIGVsZW0sIGksIHVudGlsICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcInBhcmVudE5vZGVcIiwgdW50aWwgKTtcblx0fSxcblx0bmV4dDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5udGgoIGVsZW0sIDIsIFwibmV4dFNpYmxpbmdcIiApO1xuXHR9LFxuXHRwcmV2OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5Lm50aCggZWxlbSwgMiwgXCJwcmV2aW91c1NpYmxpbmdcIiApO1xuXHR9LFxuXHRuZXh0QWxsOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJuZXh0U2libGluZ1wiICk7XG5cdH0sXG5cdHByZXZBbGw6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcInByZXZpb3VzU2libGluZ1wiICk7XG5cdH0sXG5cdG5leHRVbnRpbDogZnVuY3Rpb24oIGVsZW0sIGksIHVudGlsICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcIm5leHRTaWJsaW5nXCIsIHVudGlsICk7XG5cdH0sXG5cdHByZXZVbnRpbDogZnVuY3Rpb24oIGVsZW0sIGksIHVudGlsICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcInByZXZpb3VzU2libGluZ1wiLCB1bnRpbCApO1xuXHR9LFxuXHRzaWJsaW5nczogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5zaWJsaW5nKCBlbGVtLnBhcmVudE5vZGUuZmlyc3RDaGlsZCwgZWxlbSApO1xuXHR9LFxuXHRjaGlsZHJlbjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5zaWJsaW5nKCBlbGVtLmZpcnN0Q2hpbGQgKTtcblx0fSxcblx0Y29udGVudHM6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkubm9kZU5hbWUoIGVsZW0sIFwiaWZyYW1lXCIgKSA/XG5cdFx0XHRlbGVtLmNvbnRlbnREb2N1bWVudCB8fCBlbGVtLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQgOlxuXHRcdFx0alF1ZXJ5Lm1ha2VBcnJheSggZWxlbS5jaGlsZE5vZGVzICk7XG5cdH1cbn0sIGZ1bmN0aW9uKCBuYW1lLCBmbiApIHtcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggdW50aWwsIHNlbGVjdG9yICkge1xuXHRcdHZhciByZXQgPSBqUXVlcnkubWFwKCB0aGlzLCBmbiwgdW50aWwgKTtcblx0XHRcblx0XHRpZiAoICFydW50aWwudGVzdCggbmFtZSApICkge1xuXHRcdFx0c2VsZWN0b3IgPSB1bnRpbDtcblx0XHR9XG5cblx0XHRpZiAoIHNlbGVjdG9yICYmIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldCA9IGpRdWVyeS5maWx0ZXIoIHNlbGVjdG9yLCByZXQgKTtcblx0XHR9XG5cblx0XHRyZXQgPSB0aGlzLmxlbmd0aCA+IDEgPyBqUXVlcnkudW5pcXVlKCByZXQgKSA6IHJldDtcblxuXHRcdGlmICggKHRoaXMubGVuZ3RoID4gMSB8fCBybXVsdGlzZWxlY3Rvci50ZXN0KCBzZWxlY3RvciApKSAmJiBycGFyZW50c3ByZXYudGVzdCggbmFtZSApICkge1xuXHRcdFx0cmV0ID0gcmV0LnJldmVyc2UoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHJldCwgbmFtZSwgc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oXCIsXCIpICk7XG5cdH07XG59KTtcblxualF1ZXJ5LmV4dGVuZCh7XG5cdGZpbHRlcjogZnVuY3Rpb24oIGV4cHIsIGVsZW1zLCBub3QgKSB7XG5cdFx0aWYgKCBub3QgKSB7XG5cdFx0XHRleHByID0gXCI6bm90KFwiICsgZXhwciArIFwiKVwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkuZmluZC5tYXRjaGVzKGV4cHIsIGVsZW1zKTtcblx0fSxcblx0XG5cdGRpcjogZnVuY3Rpb24oIGVsZW0sIGRpciwgdW50aWwgKSB7XG5cdFx0dmFyIG1hdGNoZWQgPSBbXSwgY3VyID0gZWxlbVtkaXJdO1xuXHRcdHdoaWxlICggY3VyICYmIGN1ci5ub2RlVHlwZSAhPT0gOSAmJiAodW50aWwgPT09IHVuZGVmaW5lZCB8fCBjdXIubm9kZVR5cGUgIT09IDEgfHwgIWpRdWVyeSggY3VyICkuaXMoIHVudGlsICkpICkge1xuXHRcdFx0aWYgKCBjdXIubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdG1hdGNoZWQucHVzaCggY3VyICk7XG5cdFx0XHR9XG5cdFx0XHRjdXIgPSBjdXJbZGlyXTtcblx0XHR9XG5cdFx0cmV0dXJuIG1hdGNoZWQ7XG5cdH0sXG5cblx0bnRoOiBmdW5jdGlvbiggY3VyLCByZXN1bHQsIGRpciwgZWxlbSApIHtcblx0XHRyZXN1bHQgPSByZXN1bHQgfHwgMTtcblx0XHR2YXIgbnVtID0gMDtcblxuXHRcdGZvciAoIDsgY3VyOyBjdXIgPSBjdXJbZGlyXSApIHtcblx0XHRcdGlmICggY3VyLm5vZGVUeXBlID09PSAxICYmICsrbnVtID09PSByZXN1bHQgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjdXI7XG5cdH0sXG5cblx0c2libGluZzogZnVuY3Rpb24oIG4sIGVsZW0gKSB7XG5cdFx0dmFyIHIgPSBbXTtcblxuXHRcdGZvciAoIDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRpZiAoIG4ubm9kZVR5cGUgPT09IDEgJiYgbiAhPT0gZWxlbSApIHtcblx0XHRcdFx0ci5wdXNoKCBuICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHI7XG5cdH1cbn0pO1xudmFyIHJpbmxpbmVqUXVlcnkgPSAvIGpRdWVyeVxcZCs9XCIoPzpcXGQrfG51bGwpXCIvZyxcblx0cmxlYWRpbmdXaGl0ZXNwYWNlID0gL15cXHMrLyxcblx0cnhodG1sVGFnID0gLyg8KFtcXHc6XSspW14+XSo/KVxcLz4vZyxcblx0cnNlbGZDbG9zaW5nID0gL14oPzphcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSQvaSxcblx0cnRhZ05hbWUgPSAvPChbXFx3Ol0rKS8sXG5cdHJ0Ym9keSA9IC88dGJvZHkvaSxcblx0cmh0bWwgPSAvPHwmIz9cXHcrOy8sXG5cdHJub2NhY2hlID0gLzxzY3JpcHR8PG9iamVjdHw8ZW1iZWR8PG9wdGlvbnw8c3R5bGUvaSxcblx0cmNoZWNrZWQgPSAvY2hlY2tlZFxccyooPzpbXj1dfD1cXHMqLmNoZWNrZWQuKS9pLCAgLy8gY2hlY2tlZD1cImNoZWNrZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIGNoZWNrZWQgKGh0bWw1KVxuXHRmY2xvc2VUYWcgPSBmdW5jdGlvbiggYWxsLCBmcm9udCwgdGFnICkge1xuXHRcdHJldHVybiByc2VsZkNsb3NpbmcudGVzdCggdGFnICkgP1xuXHRcdFx0YWxsIDpcblx0XHRcdGZyb250ICsgXCI+PC9cIiArIHRhZyArIFwiPlwiO1xuXHR9LFxuXHR3cmFwTWFwID0ge1xuXHRcdG9wdGlvbjogWyAxLCBcIjxzZWxlY3QgbXVsdGlwbGU9J211bHRpcGxlJz5cIiwgXCI8L3NlbGVjdD5cIiBdLFxuXHRcdGxlZ2VuZDogWyAxLCBcIjxmaWVsZHNldD5cIiwgXCI8L2ZpZWxkc2V0PlwiIF0sXG5cdFx0dGhlYWQ6IFsgMSwgXCI8dGFibGU+XCIsIFwiPC90YWJsZT5cIiBdLFxuXHRcdHRyOiBbIDIsIFwiPHRhYmxlPjx0Ym9keT5cIiwgXCI8L3Rib2R5PjwvdGFibGU+XCIgXSxcblx0XHR0ZDogWyAzLCBcIjx0YWJsZT48dGJvZHk+PHRyPlwiLCBcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiIF0sXG5cdFx0Y29sOiBbIDIsIFwiPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD5cIiwgXCI8L2NvbGdyb3VwPjwvdGFibGU+XCIgXSxcblx0XHRhcmVhOiBbIDEsIFwiPG1hcD5cIiwgXCI8L21hcD5cIiBdLFxuXHRcdF9kZWZhdWx0OiBbIDAsIFwiXCIsIFwiXCIgXVxuXHR9O1xuXG53cmFwTWFwLm9wdGdyb3VwID0gd3JhcE1hcC5vcHRpb247XG53cmFwTWFwLnRib2R5ID0gd3JhcE1hcC50Zm9vdCA9IHdyYXBNYXAuY29sZ3JvdXAgPSB3cmFwTWFwLmNhcHRpb24gPSB3cmFwTWFwLnRoZWFkO1xud3JhcE1hcC50aCA9IHdyYXBNYXAudGQ7XG5cbi8vIElFIGNhbid0IHNlcmlhbGl6ZSA8bGluaz4gYW5kIDxzY3JpcHQ+IHRhZ3Mgbm9ybWFsbHlcbmlmICggIWpRdWVyeS5zdXBwb3J0Lmh0bWxTZXJpYWxpemUgKSB7XG5cdHdyYXBNYXAuX2RlZmF1bHQgPSBbIDEsIFwiZGl2PGRpdj5cIiwgXCI8L2Rpdj5cIiBdO1xufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0dGV4dDogZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbih0ZXh0KSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSh0aGlzKTtcblx0XHRcdFx0c2VsZi50ZXh0KCB0ZXh0LmNhbGwodGhpcywgaSwgc2VsZi50ZXh0KCkpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB0ZXh0ICE9PSBcIm9iamVjdFwiICYmIHRleHQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiB0aGlzLmVtcHR5KCkuYXBwZW5kKCAodGhpc1swXSAmJiB0aGlzWzBdLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNyZWF0ZVRleHROb2RlKCB0ZXh0ICkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4galF1ZXJ5LnRleHQoIHRoaXMgKTtcblx0fSxcblxuXHR3cmFwQWxsOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBodG1sICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGkpIHtcblx0XHRcdFx0alF1ZXJ5KHRoaXMpLndyYXBBbGwoIGh0bWwuY2FsbCh0aGlzLCBpKSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzWzBdICkge1xuXHRcdFx0Ly8gVGhlIGVsZW1lbnRzIHRvIHdyYXAgdGhlIHRhcmdldCBhcm91bmRcblx0XHRcdHZhciB3cmFwID0galF1ZXJ5KCBodG1sLCB0aGlzWzBdLm93bmVyRG9jdW1lbnQgKS5lcSgwKS5jbG9uZSh0cnVlKTtcblxuXHRcdFx0aWYgKCB0aGlzWzBdLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdHdyYXAuaW5zZXJ0QmVmb3JlKCB0aGlzWzBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHdyYXAubWFwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IHRoaXM7XG5cblx0XHRcdFx0d2hpbGUgKCBlbGVtLmZpcnN0Q2hpbGQgJiYgZWxlbS5maXJzdENoaWxkLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZWxlbTtcblx0XHRcdH0pLmFwcGVuZCh0aGlzKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR3cmFwSW5uZXI6IGZ1bmN0aW9uKCBodG1sICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGh0bWwgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRqUXVlcnkodGhpcykud3JhcElubmVyKCBodG1sLmNhbGwodGhpcywgaSkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSggdGhpcyApLCBjb250ZW50cyA9IHNlbGYuY29udGVudHMoKTtcblxuXHRcdFx0aWYgKCBjb250ZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRlbnRzLndyYXBBbGwoIGh0bWwgKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5hcHBlbmQoIGh0bWwgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHR3cmFwOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkud3JhcEFsbCggaHRtbCApO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHVud3JhcDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyZW50KCkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJib2R5XCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVwbGFjZVdpdGgoIHRoaXMuY2hpbGROb2RlcyApO1xuXHRcdFx0fVxuXHRcdH0pLmVuZCgpO1xuXHR9LFxuXG5cdGFwcGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCB0cnVlLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdHByZXBlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cywgdHJ1ZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdHRoaXMuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0aGlzLmZpcnN0Q2hpbGQgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRiZWZvcmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpc1swXSAmJiB0aGlzWzBdLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsIGZhbHNlLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcyApO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdHZhciBzZXQgPSBqUXVlcnkoYXJndW1lbnRzWzBdKTtcblx0XHRcdHNldC5wdXNoLmFwcGx5KCBzZXQsIHRoaXMudG9BcnJheSgpICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHNldCwgXCJiZWZvcmVcIiwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9LFxuXG5cdGFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXNbMF0gJiYgdGhpc1swXS5wYXJlbnROb2RlICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCBmYWxzZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGVsZW0sIHRoaXMubmV4dFNpYmxpbmcgKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHR2YXIgc2V0ID0gdGhpcy5wdXNoU3RhY2soIHRoaXMsIFwiYWZ0ZXJcIiwgYXJndW1lbnRzICk7XG5cdFx0XHRzZXQucHVzaC5hcHBseSggc2V0LCBqUXVlcnkoYXJndW1lbnRzWzBdKS50b0FycmF5KCkgKTtcblx0XHRcdHJldHVybiBzZXQ7XG5cdFx0fVxuXHR9LFxuXHRcblx0Ly8ga2VlcERhdGEgaXMgZm9yIGludGVybmFsIHVzZSBvbmx5LS1kbyBub3QgZG9jdW1lbnRcblx0cmVtb3ZlOiBmdW5jdGlvbiggc2VsZWN0b3IsIGtlZXBEYXRhICkge1xuXHRcdGZvciAoIHZhciBpID0gMCwgZWxlbTsgKGVsZW0gPSB0aGlzW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRpZiAoICFzZWxlY3RvciB8fCBqUXVlcnkuZmlsdGVyKCBzZWxlY3RvciwgWyBlbGVtIF0gKS5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggIWtlZXBEYXRhICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgKTtcblx0XHRcdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBbIGVsZW0gXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0IGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGVtcHR5OiBmdW5jdGlvbigpIHtcblx0XHRmb3IgKCB2YXIgaSA9IDAsIGVsZW07IChlbGVtID0gdGhpc1tpXSkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0Ly8gUmVtb3ZlIGVsZW1lbnQgbm9kZXMgYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtzXG5cdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSBhbnkgcmVtYWluaW5nIG5vZGVzXG5cdFx0XHR3aGlsZSAoIGVsZW0uZmlyc3RDaGlsZCApIHtcblx0XHRcdFx0ZWxlbS5yZW1vdmVDaGlsZCggZWxlbS5maXJzdENoaWxkICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGNsb25lOiBmdW5jdGlvbiggZXZlbnRzICkge1xuXHRcdC8vIERvIHRoZSBjbG9uZVxuXHRcdHZhciByZXQgPSB0aGlzLm1hcChmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIWpRdWVyeS5zdXBwb3J0Lm5vQ2xvbmVFdmVudCAmJiAhalF1ZXJ5LmlzWE1MRG9jKHRoaXMpICkge1xuXHRcdFx0XHQvLyBJRSBjb3BpZXMgZXZlbnRzIGJvdW5kIHZpYSBhdHRhY2hFdmVudCB3aGVuXG5cdFx0XHRcdC8vIHVzaW5nIGNsb25lTm9kZS4gQ2FsbGluZyBkZXRhY2hFdmVudCBvbiB0aGVcblx0XHRcdFx0Ly8gY2xvbmUgd2lsbCBhbHNvIHJlbW92ZSB0aGUgZXZlbnRzIGZyb20gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yaWduYWxcblx0XHRcdFx0Ly8gSW4gb3JkZXIgdG8gZ2V0IGFyb3VuZCB0aGlzLCB3ZSB1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5uZXJIVE1MLlxuXHRcdFx0XHQvLyBVbmZvcnR1bmF0ZWx5LCB0aGlzIG1lYW5zIHNvbWUgbW9kaWZpY2F0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b1xuXHRcdFx0XHQvLyBhdHRyaWJ1dGVzIGluIElFIHRoYXQgYXJlIGFjdHVhbGx5IG9ubHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmVkXG5cdFx0XHRcdC8vIGFzIHByb3BlcnRpZXMgd2lsbCBub3QgYmUgY29waWVkIChzdWNoIGFzIHRoZVxuXHRcdFx0XHQvLyB0aGUgbmFtZSBhdHRyaWJ1dGUgb24gYW4gaW5wdXQpLlxuXHRcdFx0XHR2YXIgaHRtbCA9IHRoaXMub3V0ZXJIVE1MLCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50O1xuXHRcdFx0XHRpZiAoICFodG1sICkge1xuXHRcdFx0XHRcdHZhciBkaXYgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0ZGl2LmFwcGVuZENoaWxkKCB0aGlzLmNsb25lTm9kZSh0cnVlKSApO1xuXHRcdFx0XHRcdGh0bWwgPSBkaXYuaW5uZXJIVE1MO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGpRdWVyeS5jbGVhbihbaHRtbC5yZXBsYWNlKHJpbmxpbmVqUXVlcnksIFwiXCIpXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBjYXNlIGluIElFIDggd2hlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhY3Rpb249L3Rlc3QvPiBzZWxmLWNsb3NlcyBhIHRhZ1xuXHRcdFx0XHRcdC5yZXBsYWNlKC89KFtePVwiJz5cXHNdK1xcLyk+L2csICc9XCIkMVwiPicpXG5cdFx0XHRcdFx0LnJlcGxhY2UocmxlYWRpbmdXaGl0ZXNwYWNlLCBcIlwiKV0sIG93bmVyRG9jdW1lbnQpWzBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gQ29weSB0aGUgZXZlbnRzIGZyb20gdGhlIG9yaWdpbmFsIHRvIHRoZSBjbG9uZVxuXHRcdGlmICggZXZlbnRzID09PSB0cnVlICkge1xuXHRcdFx0Y2xvbmVDb3B5RXZlbnQoIHRoaXMsIHJldCApO1xuXHRcdFx0Y2xvbmVDb3B5RXZlbnQoIHRoaXMuZmluZChcIipcIiksIHJldC5maW5kKFwiKlwiKSApO1xuXHRcdH1cblxuXHRcdC8vIFJldHVybiB0aGUgY2xvbmVkIHNldFxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0aHRtbDogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdGlmICggdmFsdWUgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiB0aGlzWzBdICYmIHRoaXNbMF0ubm9kZVR5cGUgPT09IDEgP1xuXHRcdFx0XHR0aGlzWzBdLmlubmVySFRNTC5yZXBsYWNlKHJpbmxpbmVqUXVlcnksIFwiXCIpIDpcblx0XHRcdFx0bnVsbDtcblxuXHRcdC8vIFNlZSBpZiB3ZSBjYW4gdGFrZSBhIHNob3J0Y3V0IGFuZCBqdXN0IHVzZSBpbm5lckhUTUxcblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgIXJub2NhY2hlLnRlc3QoIHZhbHVlICkgJiZcblx0XHRcdChqUXVlcnkuc3VwcG9ydC5sZWFkaW5nV2hpdGVzcGFjZSB8fCAhcmxlYWRpbmdXaGl0ZXNwYWNlLnRlc3QoIHZhbHVlICkpICYmXG5cdFx0XHQhd3JhcE1hcFsgKHJ0YWdOYW1lLmV4ZWMoIHZhbHVlICkgfHwgW1wiXCIsIFwiXCJdKVsxXS50b0xvd2VyQ2FzZSgpIF0gKSB7XG5cblx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShyeGh0bWxUYWcsIGZjbG9zZVRhZyk7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSBlbGVtZW50IG5vZGVzIGFuZCBwcmV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVtb3J5IGxlYWtzXG5cdFx0XHRcdFx0aWYgKCB0aGlzW2ldLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggdGhpc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgKTtcblx0XHRcdFx0XHRcdHRoaXNbaV0uaW5uZXJIVE1MID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdC8vIElmIHVzaW5nIGlubmVySFRNTCB0aHJvd3MgYW4gZXhjZXB0aW9uLCB1c2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxsYmFjayBtZXRob2Rcblx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHR0aGlzLmVtcHR5KCkuYXBwZW5kKCB2YWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciBzZWxmID0galF1ZXJ5KHRoaXMpLCBvbGQgPSBzZWxmLmh0bWwoKTtcblx0XHRcdFx0c2VsZi5lbXB0eSgpLmFwcGVuZChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZS5jYWxsKCB0aGlzLCBpLCBvbGQgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmVtcHR5KCkuYXBwZW5kKCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlcGxhY2VXaXRoOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0aWYgKCB0aGlzWzBdICYmIHRoaXNbMF0ucGFyZW50Tm9kZSApIHtcblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlZm9yZSB0aGV5IGFyZSBpbnNlcnRlZFxuXHRcdFx0Ly8gdGhpcyBjYW4gaGVscCBmaXggcmVwbGFjaW5nIGEgcGFyZW50IHdpdGggY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnRzXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGkpIHtcblx0XHRcdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSh0aGlzKSwgb2xkID0gc2VsZi5odG1sKCk7XG5cdFx0XHRcdFx0c2VsZi5yZXBsYWNlV2l0aCggdmFsdWUuY2FsbCggdGhpcywgaSwgb2xkICkgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHR2YWx1ZSA9IGpRdWVyeSh2YWx1ZSkuZGV0YWNoKCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBuZXh0ID0gdGhpcy5uZXh0U2libGluZywgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0XHRcdGpRdWVyeSh0aGlzKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRpZiAoIG5leHQgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KG5leHQpLmJlZm9yZSggdmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRqUXVlcnkocGFyZW50KS5hcHBlbmQoIHZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeShqUXVlcnkuaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSgpIDogdmFsdWUpLCBcInJlcGxhY2VXaXRoXCIsIHZhbHVlICk7XG5cdFx0fVxuXHR9LFxuXG5cdGRldGFjaDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiB0aGlzLnJlbW92ZSggc2VsZWN0b3IsIHRydWUgKTtcblx0fSxcblxuXHRkb21NYW5pcDogZnVuY3Rpb24oIGFyZ3MsIHRhYmxlLCBjYWxsYmFjayApIHtcblx0XHR2YXIgcmVzdWx0cywgZmlyc3QsIHZhbHVlID0gYXJnc1swXSwgc2NyaXB0cyA9IFtdLCBmcmFnbWVudCwgcGFyZW50O1xuXG5cdFx0Ly8gV2UgY2FuJ3QgY2xvbmVOb2RlIGZyYWdtZW50cyB0aGF0IGNvbnRhaW4gY2hlY2tlZCwgaW4gV2ViS2l0XG5cdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQuY2hlY2tDbG9uZSAmJiBhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiByY2hlY2tlZC50ZXN0KCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5KHRoaXMpLmRvbU1hbmlwKCBhcmdzLCB0YWJsZSwgY2FsbGJhY2ssIHRydWUgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdHZhciBzZWxmID0galF1ZXJ5KHRoaXMpO1xuXHRcdFx0XHRhcmdzWzBdID0gdmFsdWUuY2FsbCh0aGlzLCBpLCB0YWJsZSA/IHNlbGYuaHRtbCgpIDogdW5kZWZpbmVkKTtcblx0XHRcdFx0c2VsZi5kb21NYW5pcCggYXJncywgdGFibGUsIGNhbGxiYWNrICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXNbMF0gKSB7XG5cdFx0XHRwYXJlbnQgPSB2YWx1ZSAmJiB2YWx1ZS5wYXJlbnROb2RlO1xuXG5cdFx0XHQvLyBJZiB3ZSdyZSBpbiBhIGZyYWdtZW50LCBqdXN0IHVzZSB0aGF0IGluc3RlYWQgb2ZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1aWxkaW5nIGEgbmV3IG9uZVxuXHRcdFx0aWYgKCBqUXVlcnkuc3VwcG9ydC5wYXJlbnROb2RlICYmIHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT09IDExICYmIHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gdGhpcy5sZW5ndGggKSB7XG5cdFx0XHRcdHJlc3VsdHMgPSB7IGZyYWdtZW50OiBwYXJlbnQgfTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0cyA9IGJ1aWxkRnJhZ21lbnQoIGFyZ3MsIHRoaXMsIHNjcmlwdHMgKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0ZnJhZ21lbnQgPSByZXN1bHRzLmZyYWdtZW50O1xuXHRcdFx0XG5cdFx0XHRpZiAoIGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRmaXJzdCA9IGZyYWdtZW50ID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpcnN0ID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBmaXJzdCApIHtcblx0XHRcdFx0dGFibGUgPSB0YWJsZSAmJiBqUXVlcnkubm9kZU5hbWUoIGZpcnN0LCBcInRyXCIgKTtcblxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKFxuXHRcdFx0XHRcdFx0dGFibGUgP1xuXHRcdFx0XHRcdFx0XHRyb290KHRoaXNbaV0sIGZpcnN0KSA6XG5cdFx0XHRcdFx0XHRcdHRoaXNbaV0sXG5cdFx0XHRcdFx0XHRpID4gMCB8fCByZXN1bHRzLmNhY2hlYWJsZSB8fCB0aGlzLmxlbmd0aCA+IDEgID9cblx0XHRcdFx0XHRcdFx0ZnJhZ21lbnQuY2xvbmVOb2RlKHRydWUpIDpcblx0XHRcdFx0XHRcdFx0ZnJhZ21lbnRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggc2NyaXB0cy5sZW5ndGggKSB7XG5cdFx0XHRcdGpRdWVyeS5lYWNoKCBzY3JpcHRzLCBldmFsU2NyaXB0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0XHRmdW5jdGlvbiByb290KCBlbGVtLCBjdXIgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5Lm5vZGVOYW1lKGVsZW0sIFwidGFibGVcIikgP1xuXHRcdFx0XHQoZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdIHx8XG5cdFx0XHRcdGVsZW0uYXBwZW5kQ2hpbGQoZWxlbS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKSkpIDpcblx0XHRcdFx0ZWxlbTtcblx0XHR9XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBjbG9uZUNvcHlFdmVudChvcmlnLCByZXQpIHtcblx0dmFyIGkgPSAwO1xuXG5cdHJldC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5ub2RlTmFtZSAhPT0gKG9yaWdbaV0gJiYgb3JpZ1tpXS5ub2RlTmFtZSkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIG9sZERhdGEgPSBqUXVlcnkuZGF0YSggb3JpZ1tpKytdICksIGN1ckRhdGEgPSBqUXVlcnkuZGF0YSggdGhpcywgb2xkRGF0YSApLCBldmVudHMgPSBvbGREYXRhICYmIG9sZERhdGEuZXZlbnRzO1xuXG5cdFx0aWYgKCBldmVudHMgKSB7XG5cdFx0XHRkZWxldGUgY3VyRGF0YS5oYW5kbGU7XG5cdFx0XHRjdXJEYXRhLmV2ZW50cyA9IHt9O1xuXG5cdFx0XHRmb3IgKCB2YXIgdHlwZSBpbiBldmVudHMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBoYW5kbGVyIGluIGV2ZW50c1sgdHlwZSBdICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIHRoaXMsIHR5cGUsIGV2ZW50c1sgdHlwZSBdWyBoYW5kbGVyIF0sIGV2ZW50c1sgdHlwZSBdWyBoYW5kbGVyIF0uZGF0YSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gYnVpbGRGcmFnbWVudCggYXJncywgbm9kZXMsIHNjcmlwdHMgKSB7XG5cdHZhciBmcmFnbWVudCwgY2FjaGVhYmxlLCBjYWNoZXJlc3VsdHMsXG5cdFx0ZG9jID0gKG5vZGVzICYmIG5vZGVzWzBdID8gbm9kZXNbMF0ub3duZXJEb2N1bWVudCB8fCBub2Rlc1swXSA6IGRvY3VtZW50KTtcblxuXHQvLyBPbmx5IGNhY2hlIFwic21hbGxcIiAoMS8yIEtCKSBzdHJpbmdzIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgbWFpblxuICAgICAgICAvLyBkb2N1bWVudFxuXHQvLyBDbG9uaW5nIG9wdGlvbnMgbG9zZXMgdGhlIHNlbGVjdGVkIHN0YXRlLCBzbyBkb24ndCBjYWNoZSB0aGVtXG5cdC8vIElFIDYgZG9lc24ndCBsaWtlIGl0IHdoZW4geW91IHB1dCA8b2JqZWN0PiBvciA8ZW1iZWQ+IGVsZW1lbnRzIGluIGFcbiAgICAgICAgLy8gZnJhZ21lbnRcblx0Ly8gQWxzbywgV2ViS2l0IGRvZXMgbm90IGNsb25lICdjaGVja2VkJyBhdHRyaWJ1dGVzIG9uIGNsb25lTm9kZSwgc29cbiAgICAgICAgLy8gZG9uJ3QgY2FjaGVcblx0aWYgKCBhcmdzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIiAmJiBhcmdzWzBdLmxlbmd0aCA8IDUxMiAmJiBkb2MgPT09IGRvY3VtZW50ICYmXG5cdFx0IXJub2NhY2hlLnRlc3QoIGFyZ3NbMF0gKSAmJiAoalF1ZXJ5LnN1cHBvcnQuY2hlY2tDbG9uZSB8fCAhcmNoZWNrZWQudGVzdCggYXJnc1swXSApKSApIHtcblxuXHRcdGNhY2hlYWJsZSA9IHRydWU7XG5cdFx0Y2FjaGVyZXN1bHRzID0galF1ZXJ5LmZyYWdtZW50c1sgYXJnc1swXSBdO1xuXHRcdGlmICggY2FjaGVyZXN1bHRzICkge1xuXHRcdFx0aWYgKCBjYWNoZXJlc3VsdHMgIT09IDEgKSB7XG5cdFx0XHRcdGZyYWdtZW50ID0gY2FjaGVyZXN1bHRzO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICggIWZyYWdtZW50ICkge1xuXHRcdGZyYWdtZW50ID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRqUXVlcnkuY2xlYW4oIGFyZ3MsIGRvYywgZnJhZ21lbnQsIHNjcmlwdHMgKTtcblx0fVxuXG5cdGlmICggY2FjaGVhYmxlICkge1xuXHRcdGpRdWVyeS5mcmFnbWVudHNbIGFyZ3NbMF0gXSA9IGNhY2hlcmVzdWx0cyA/IGZyYWdtZW50IDogMTtcblx0fVxuXG5cdHJldHVybiB7IGZyYWdtZW50OiBmcmFnbWVudCwgY2FjaGVhYmxlOiBjYWNoZWFibGUgfTtcbn1cblxualF1ZXJ5LmZyYWdtZW50cyA9IHt9O1xuXG5qUXVlcnkuZWFjaCh7XG5cdGFwcGVuZFRvOiBcImFwcGVuZFwiLFxuXHRwcmVwZW5kVG86IFwicHJlcGVuZFwiLFxuXHRpbnNlcnRCZWZvcmU6IFwiYmVmb3JlXCIsXG5cdGluc2VydEFmdGVyOiBcImFmdGVyXCIsXG5cdHJlcGxhY2VBbGw6IFwicmVwbGFjZVdpdGhcIlxufSwgZnVuY3Rpb24oIG5hbWUsIG9yaWdpbmFsICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgcmV0ID0gW10sIGluc2VydCA9IGpRdWVyeSggc2VsZWN0b3IgKSxcblx0XHRcdHBhcmVudCA9IHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXNbMF0ucGFyZW50Tm9kZTtcblx0XHRcblx0XHRpZiAoIHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT09IDExICYmIHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiBpbnNlcnQubGVuZ3RoID09PSAxICkge1xuXHRcdFx0aW5zZXJ0WyBvcmlnaW5hbCBdKCB0aGlzWzBdICk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBpbnNlcnQubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHR2YXIgZWxlbXMgPSAoaSA+IDAgPyB0aGlzLmNsb25lKHRydWUpIDogdGhpcykuZ2V0KCk7XG5cdFx0XHRcdGpRdWVyeS5mblsgb3JpZ2luYWwgXS5hcHBseSggalF1ZXJ5KGluc2VydFtpXSksIGVsZW1zICk7XG5cdFx0XHRcdHJldCA9IHJldC5jb25jYXQoIGVsZW1zICk7XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHJldCwgbmFtZSwgaW5zZXJ0LnNlbGVjdG9yICk7XG5cdFx0fVxuXHR9O1xufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHRjbGVhbjogZnVuY3Rpb24oIGVsZW1zLCBjb250ZXh0LCBmcmFnbWVudCwgc2NyaXB0cyApIHtcblx0XHRjb250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcblxuXHRcdC8vICFjb250ZXh0LmNyZWF0ZUVsZW1lbnQgZmFpbHMgaW4gSUUgd2l0aCBhbiBlcnJvciBidXQgcmV0dXJuc1xuICAgICAgICAgICAgICAgIC8vIHR5cGVvZiAnb2JqZWN0J1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuY3JlYXRlRWxlbWVudCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdGNvbnRleHQgPSBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dFswXSAmJiBjb250ZXh0WzBdLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCA9IFtdO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBlbGVtOyAoZWxlbSA9IGVsZW1zW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRlbGVtICs9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb252ZXJ0IGh0bWwgc3RyaW5nIGludG8gRE9NIG5vZGVzXG5cdFx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiICYmICFyaHRtbC50ZXN0KCBlbGVtICkgKSB7XG5cdFx0XHRcdGVsZW0gPSBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtICk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHQvLyBGaXggXCJYSFRNTFwiLXN0eWxlIHRhZ3MgaW4gYWxsIGJyb3dzZXJzXG5cdFx0XHRcdGVsZW0gPSBlbGVtLnJlcGxhY2UocnhodG1sVGFnLCBmY2xvc2VUYWcpO1xuXG5cdFx0XHRcdC8vIFRyaW0gd2hpdGVzcGFjZSwgb3RoZXJ3aXNlIGluZGV4T2Ygd29uJ3Qgd29ya1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcyBleHBlY3RlZFxuXHRcdFx0XHR2YXIgdGFnID0gKHJ0YWdOYW1lLmV4ZWMoIGVsZW0gKSB8fCBbXCJcIiwgXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0d3JhcCA9IHdyYXBNYXBbIHRhZyBdIHx8IHdyYXBNYXAuX2RlZmF1bHQsXG5cdFx0XHRcdFx0ZGVwdGggPSB3cmFwWzBdLFxuXHRcdFx0XHRcdGRpdiA9IGNvbnRleHQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdFx0XHQvLyBHbyB0byBodG1sIGFuZCBiYWNrLCB0aGVuIHBlZWwgb2ZmIGV4dHJhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdyYXBwZXJzXG5cdFx0XHRcdGRpdi5pbm5lckhUTUwgPSB3cmFwWzFdICsgZWxlbSArIHdyYXBbMl07XG5cblx0XHRcdFx0Ly8gTW92ZSB0byB0aGUgcmlnaHQgZGVwdGhcblx0XHRcdFx0d2hpbGUgKCBkZXB0aC0tICkge1xuXHRcdFx0XHRcdGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZW1vdmUgSUUncyBhdXRvaW5zZXJ0ZWQgPHRib2R5PiBmcm9tIHRhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyYWdtZW50c1xuXHRcdFx0XHRpZiAoICFqUXVlcnkuc3VwcG9ydC50Ym9keSApIHtcblxuXHRcdFx0XHRcdC8vIFN0cmluZyB3YXMgYSA8dGFibGU+LCAqbWF5KiBoYXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3B1cmlvdXMgPHRib2R5PlxuXHRcdFx0XHRcdHZhciBoYXNCb2R5ID0gcnRib2R5LnRlc3QoZWxlbSksXG5cdFx0XHRcdFx0XHR0Ym9keSA9IHRhZyA9PT0gXCJ0YWJsZVwiICYmICFoYXNCb2R5ID9cblx0XHRcdFx0XHRcdFx0ZGl2LmZpcnN0Q2hpbGQgJiYgZGl2LmZpcnN0Q2hpbGQuY2hpbGROb2RlcyA6XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3RyaW5nIHdhcyBhIGJhcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPHRoZWFkPiBvciA8dGZvb3Q+XG5cdFx0XHRcdFx0XHRcdHdyYXBbMV0gPT09IFwiPHRhYmxlPlwiICYmICFoYXNCb2R5ID9cblx0XHRcdFx0XHRcdFx0XHRkaXYuY2hpbGROb2RlcyA6XG5cdFx0XHRcdFx0XHRcdFx0W107XG5cblx0XHRcdFx0XHRmb3IgKCB2YXIgaiA9IHRib2R5Lmxlbmd0aCAtIDE7IGogPj0gMCA7IC0taiApIHtcblx0XHRcdFx0XHRcdGlmICggalF1ZXJ5Lm5vZGVOYW1lKCB0Ym9keVsgaiBdLCBcInRib2R5XCIgKSAmJiAhdGJvZHlbIGogXS5jaGlsZE5vZGVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0dGJvZHlbIGogXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0Ym9keVsgaiBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJRSBjb21wbGV0ZWx5IGtpbGxzIGxlYWRpbmcgd2hpdGVzcGFjZSB3aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlubmVySFRNTCBpcyB1c2VkXG5cdFx0XHRcdGlmICggIWpRdWVyeS5zdXBwb3J0LmxlYWRpbmdXaGl0ZXNwYWNlICYmIHJsZWFkaW5nV2hpdGVzcGFjZS50ZXN0KCBlbGVtICkgKSB7XG5cdFx0XHRcdFx0ZGl2Lmluc2VydEJlZm9yZSggY29udGV4dC5jcmVhdGVUZXh0Tm9kZSggcmxlYWRpbmdXaGl0ZXNwYWNlLmV4ZWMoZWxlbSlbMF0gKSwgZGl2LmZpcnN0Q2hpbGQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW0gPSBkaXYuY2hpbGROb2Rlcztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlICkge1xuXHRcdFx0XHRyZXQucHVzaCggZWxlbSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0ID0galF1ZXJ5Lm1lcmdlKCByZXQsIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIGZyYWdtZW50ICkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwOyByZXRbaV07IGkrKyApIHtcblx0XHRcdFx0aWYgKCBzY3JpcHRzICYmIGpRdWVyeS5ub2RlTmFtZSggcmV0W2ldLCBcInNjcmlwdFwiICkgJiYgKCFyZXRbaV0udHlwZSB8fCByZXRbaV0udHlwZS50b0xvd2VyQ2FzZSgpID09PSBcInRleHQvamF2YXNjcmlwdFwiKSApIHtcblx0XHRcdFx0XHRzY3JpcHRzLnB1c2goIHJldFtpXS5wYXJlbnROb2RlID8gcmV0W2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHJldFtpXSApIDogcmV0W2ldICk7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICggcmV0W2ldLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0cmV0LnNwbGljZS5hcHBseSggcmV0LCBbaSArIDEsIDBdLmNvbmNhdChqUXVlcnkubWFrZUFycmF5KHJldFtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSkpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCByZXRbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cdFxuXHRjbGVhbkRhdGE6IGZ1bmN0aW9uKCBlbGVtcyApIHtcblx0XHR2YXIgZGF0YSwgaWQsIGNhY2hlID0galF1ZXJ5LmNhY2hlLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsLFxuXHRcdFx0ZGVsZXRlRXhwYW5kbyA9IGpRdWVyeS5zdXBwb3J0LmRlbGV0ZUV4cGFuZG87XG5cdFx0XG5cdFx0Zm9yICggdmFyIGkgPSAwLCBlbGVtOyAoZWxlbSA9IGVsZW1zW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRpZCA9IGVsZW1bIGpRdWVyeS5leHBhbmRvIF07XG5cdFx0XHRcblx0XHRcdGlmICggaWQgKSB7XG5cdFx0XHRcdGRhdGEgPSBjYWNoZVsgaWQgXTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmICggZGF0YS5ldmVudHMgKSB7XG5cdFx0XHRcdFx0Zm9yICggdmFyIHR5cGUgaW4gZGF0YS5ldmVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHNwZWNpYWxbIHR5cGUgXSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSApO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmVFdmVudCggZWxlbSwgdHlwZSwgZGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmICggZGVsZXRlRXhwYW5kbyApIHtcblx0XHRcdFx0XHRkZWxldGUgZWxlbVsgalF1ZXJ5LmV4cGFuZG8gXTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBlbGVtLnJlbW92ZUF0dHJpYnV0ZSApIHtcblx0XHRcdFx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggalF1ZXJ5LmV4cGFuZG8gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0ZGVsZXRlIGNhY2hlWyBpZCBdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSk7XG4vLyBleGNsdWRlIHRoZSBmb2xsb3dpbmcgY3NzIHByb3BlcnRpZXMgdG8gYWRkIHB4XG52YXIgcmV4Y2x1ZGUgPSAvei0/aW5kZXh8Zm9udC0/d2VpZ2h0fG9wYWNpdHl8em9vbXxsaW5lLT9oZWlnaHQvaSxcblx0cmFscGhhID0gL2FscGhhXFwoW14pXSpcXCkvLFxuXHRyb3BhY2l0eSA9IC9vcGFjaXR5PShbXildKikvLFxuXHRyZmxvYXQgPSAvZmxvYXQvaSxcblx0cmRhc2hBbHBoYSA9IC8tKFthLXpdKS9pZyxcblx0cnVwcGVyID0gLyhbQS1aXSkvZyxcblx0cm51bXB4ID0gL14tP1xcZCsoPzpweCk/JC9pLFxuXHRybnVtID0gL14tP1xcZC8sXG5cblx0Y3NzU2hvdyA9IHsgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgZGlzcGxheTpcImJsb2NrXCIgfSxcblx0Y3NzV2lkdGggPSBbIFwiTGVmdFwiLCBcIlJpZ2h0XCIgXSxcblx0Y3NzSGVpZ2h0ID0gWyBcIlRvcFwiLCBcIkJvdHRvbVwiIF0sXG5cblx0Ly8gY2FjaGUgY2hlY2sgZm9yIGRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGVcblx0Z2V0Q29tcHV0ZWRTdHlsZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3ICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUsXG5cdC8vIG5vcm1hbGl6ZSBmbG9hdCBjc3MgcHJvcGVydHlcblx0c3R5bGVGbG9hdCA9IGpRdWVyeS5zdXBwb3J0LmNzc0Zsb2F0ID8gXCJjc3NGbG9hdFwiIDogXCJzdHlsZUZsb2F0XCIsXG5cdGZjYW1lbENhc2UgPSBmdW5jdGlvbiggYWxsLCBsZXR0ZXIgKSB7XG5cdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuXHR9O1xuXG5qUXVlcnkuZm4uY3NzID0gZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBuYW1lLCB2YWx1ZSwgdHJ1ZSwgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xuXHRcdGlmICggdmFsdWUgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuY3VyQ1NTKCBlbGVtLCBuYW1lICk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiICYmICFyZXhjbHVkZS50ZXN0KG5hbWUpICkge1xuXHRcdFx0dmFsdWUgKz0gXCJweFwiO1xuXHRcdH1cblxuXHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgbmFtZSwgdmFsdWUgKTtcblx0fSk7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0c3R5bGU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSApIHtcblx0XHQvLyBkb24ndCBzZXQgc3R5bGVzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCApIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gaWdub3JlIG5lZ2F0aXZlIHdpZHRoIGFuZCBoZWlnaHQgdmFsdWVzICMxNTk5XG5cdFx0aWYgKCAobmFtZSA9PT0gXCJ3aWR0aFwiIHx8IG5hbWUgPT09IFwiaGVpZ2h0XCIpICYmIHBhcnNlRmxvYXQodmFsdWUpIDwgMCApIHtcblx0XHRcdHZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHZhciBzdHlsZSA9IGVsZW0uc3R5bGUgfHwgZWxlbSwgc2V0ID0gdmFsdWUgIT09IHVuZGVmaW5lZDtcblxuXHRcdC8vIElFIHVzZXMgZmlsdGVycyBmb3Igb3BhY2l0eVxuXHRcdGlmICggIWpRdWVyeS5zdXBwb3J0Lm9wYWNpdHkgJiYgbmFtZSA9PT0gXCJvcGFjaXR5XCIgKSB7XG5cdFx0XHRpZiAoIHNldCApIHtcblx0XHRcdFx0Ly8gSUUgaGFzIHRyb3VibGUgd2l0aCBvcGFjaXR5IGlmIGl0IGRvZXMgbm90XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhhdmUgbGF5b3V0XG5cdFx0XHRcdC8vIEZvcmNlIGl0IGJ5IHNldHRpbmcgdGhlIHpvb20gbGV2ZWxcblx0XHRcdFx0c3R5bGUuem9vbSA9IDE7XG5cblx0XHRcdFx0Ly8gU2V0IHRoZSBhbHBoYSBmaWx0ZXIgdG8gc2V0IHRoZSBvcGFjaXR5XG5cdFx0XHRcdHZhciBvcGFjaXR5ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApICsgXCJcIiA9PT0gXCJOYU5cIiA/IFwiXCIgOiBcImFscGhhKG9wYWNpdHk9XCIgKyB2YWx1ZSAqIDEwMCArIFwiKVwiO1xuXHRcdFx0XHR2YXIgZmlsdGVyID0gc3R5bGUuZmlsdGVyIHx8IGpRdWVyeS5jdXJDU1MoIGVsZW0sIFwiZmlsdGVyXCIgKSB8fCBcIlwiO1xuXHRcdFx0XHRzdHlsZS5maWx0ZXIgPSByYWxwaGEudGVzdChmaWx0ZXIpID8gZmlsdGVyLnJlcGxhY2UocmFscGhhLCBvcGFjaXR5KSA6IG9wYWNpdHk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdHlsZS5maWx0ZXIgJiYgc3R5bGUuZmlsdGVyLmluZGV4T2YoXCJvcGFjaXR5PVwiKSA+PSAwID9cblx0XHRcdFx0KHBhcnNlRmxvYXQoIHJvcGFjaXR5LmV4ZWMoc3R5bGUuZmlsdGVyKVsxXSApIC8gMTAwKSArIFwiXCI6XG5cdFx0XHRcdFwiXCI7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlJ3JlIHVzaW5nIHRoZSByaWdodCBuYW1lIGZvciBnZXR0aW5nIHRoZSBmbG9hdFxuICAgICAgICAgICAgICAgIC8vIHZhbHVlXG5cdFx0aWYgKCByZmxvYXQudGVzdCggbmFtZSApICkge1xuXHRcdFx0bmFtZSA9IHN0eWxlRmxvYXQ7XG5cdFx0fVxuXG5cdFx0bmFtZSA9IG5hbWUucmVwbGFjZShyZGFzaEFscGhhLCBmY2FtZWxDYXNlKTtcblxuXHRcdGlmICggc2V0ICkge1xuXHRcdFx0c3R5bGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHlsZVsgbmFtZSBdO1xuXHR9LFxuXG5cdGNzczogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGZvcmNlLCBleHRyYSApIHtcblx0XHRpZiAoIG5hbWUgPT09IFwid2lkdGhcIiB8fCBuYW1lID09PSBcImhlaWdodFwiICkge1xuXHRcdFx0dmFyIHZhbCwgcHJvcHMgPSBjc3NTaG93LCB3aGljaCA9IG5hbWUgPT09IFwid2lkdGhcIiA/IGNzc1dpZHRoIDogY3NzSGVpZ2h0O1xuXG5cdFx0XHRmdW5jdGlvbiBnZXRXSCgpIHtcblx0XHRcdFx0dmFsID0gbmFtZSA9PT0gXCJ3aWR0aFwiID8gZWxlbS5vZmZzZXRXaWR0aCA6IGVsZW0ub2Zmc2V0SGVpZ2h0O1xuXG5cdFx0XHRcdGlmICggZXh0cmEgPT09IFwiYm9yZGVyXCIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0alF1ZXJ5LmVhY2goIHdoaWNoLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoICFleHRyYSApIHtcblx0XHRcdFx0XHRcdHZhbCAtPSBwYXJzZUZsb2F0KGpRdWVyeS5jdXJDU1MoIGVsZW0sIFwicGFkZGluZ1wiICsgdGhpcywgdHJ1ZSkpIHx8IDA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBleHRyYSA9PT0gXCJtYXJnaW5cIiApIHtcblx0XHRcdFx0XHRcdHZhbCArPSBwYXJzZUZsb2F0KGpRdWVyeS5jdXJDU1MoIGVsZW0sIFwibWFyZ2luXCIgKyB0aGlzLCB0cnVlKSkgfHwgMDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFsIC09IHBhcnNlRmxvYXQoalF1ZXJ5LmN1ckNTUyggZWxlbSwgXCJib3JkZXJcIiArIHRoaXMgKyBcIldpZHRoXCIsIHRydWUpKSB8fCAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbS5vZmZzZXRXaWR0aCAhPT0gMCApIHtcblx0XHRcdFx0Z2V0V0goKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeS5zd2FwKCBlbGVtLCBwcm9wcywgZ2V0V0ggKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgucm91bmQodmFsKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS5jdXJDU1MoIGVsZW0sIG5hbWUsIGZvcmNlICk7XG5cdH0sXG5cblx0Y3VyQ1NTOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZm9yY2UgKSB7XG5cdFx0dmFyIHJldCwgc3R5bGUgPSBlbGVtLnN0eWxlLCBmaWx0ZXI7XG5cblx0XHQvLyBJRSB1c2VzIGZpbHRlcnMgZm9yIG9wYWNpdHlcblx0XHRpZiAoICFqUXVlcnkuc3VwcG9ydC5vcGFjaXR5ICYmIG5hbWUgPT09IFwib3BhY2l0eVwiICYmIGVsZW0uY3VycmVudFN0eWxlICkge1xuXHRcdFx0cmV0ID0gcm9wYWNpdHkudGVzdChlbGVtLmN1cnJlbnRTdHlsZS5maWx0ZXIgfHwgXCJcIikgP1xuXHRcdFx0XHQocGFyc2VGbG9hdChSZWdFeHAuJDEpIC8gMTAwKSArIFwiXCIgOlxuXHRcdFx0XHRcIlwiO1xuXG5cdFx0XHRyZXR1cm4gcmV0ID09PSBcIlwiID9cblx0XHRcdFx0XCIxXCIgOlxuXHRcdFx0XHRyZXQ7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlJ3JlIHVzaW5nIHRoZSByaWdodCBuYW1lIGZvciBnZXR0aW5nIHRoZSBmbG9hdFxuICAgICAgICAgICAgICAgIC8vIHZhbHVlXG5cdFx0aWYgKCByZmxvYXQudGVzdCggbmFtZSApICkge1xuXHRcdFx0bmFtZSA9IHN0eWxlRmxvYXQ7XG5cdFx0fVxuXG5cdFx0aWYgKCAhZm9yY2UgJiYgc3R5bGUgJiYgc3R5bGVbIG5hbWUgXSApIHtcblx0XHRcdHJldCA9IHN0eWxlWyBuYW1lIF07XG5cblx0XHR9IGVsc2UgaWYgKCBnZXRDb21wdXRlZFN0eWxlICkge1xuXG5cdFx0XHQvLyBPbmx5IFwiZmxvYXRcIiBpcyBuZWVkZWQgaGVyZVxuXHRcdFx0aWYgKCByZmxvYXQudGVzdCggbmFtZSApICkge1xuXHRcdFx0XHRuYW1lID0gXCJmbG9hdFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRuYW1lID0gbmFtZS5yZXBsYWNlKCBydXBwZXIsIFwiLSQxXCIgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHR2YXIgZGVmYXVsdFZpZXcgPSBlbGVtLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG5cblx0XHRcdGlmICggIWRlZmF1bHRWaWV3ICkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGNvbXB1dGVkU3R5bGUgPSBkZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKCBlbGVtLCBudWxsICk7XG5cblx0XHRcdGlmICggY29tcHV0ZWRTdHlsZSApIHtcblx0XHRcdFx0cmV0ID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBuYW1lICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlIHNob3VsZCBhbHdheXMgZ2V0IGEgbnVtYmVyIGJhY2sgZnJvbSBvcGFjaXR5XG5cdFx0XHRpZiAoIG5hbWUgPT09IFwib3BhY2l0eVwiICYmIHJldCA9PT0gXCJcIiApIHtcblx0XHRcdFx0cmV0ID0gXCIxXCI7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKCBlbGVtLmN1cnJlbnRTdHlsZSApIHtcblx0XHRcdHZhciBjYW1lbENhc2UgPSBuYW1lLnJlcGxhY2UocmRhc2hBbHBoYSwgZmNhbWVsQ2FzZSk7XG5cblx0XHRcdHJldCA9IGVsZW0uY3VycmVudFN0eWxlWyBuYW1lIF0gfHwgZWxlbS5jdXJyZW50U3R5bGVbIGNhbWVsQ2FzZSBdO1xuXG5cdFx0XHQvLyBGcm9tIHRoZSBhd2Vzb21lIGhhY2sgYnkgRGVhbiBFZHdhcmRzXG5cdFx0XHQvLyBodHRwOi8vZXJpay5lYWUubmV0L2FyY2hpdmVzLzIwMDcvMDcvMjcvMTguNTQuMTUvI2NvbW1lbnQtMTAyMjkxXG5cblx0XHRcdC8vIElmIHdlJ3JlIG5vdCBkZWFsaW5nIHdpdGggYSByZWd1bGFyIHBpeGVsIG51bWJlclxuXHRcdFx0Ly8gYnV0IGEgbnVtYmVyIHRoYXQgaGFzIGEgd2VpcmQgZW5kaW5nLCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGl0IHRvIHBpeGVsc1xuXHRcdFx0aWYgKCAhcm51bXB4LnRlc3QoIHJldCApICYmIHJudW0udGVzdCggcmV0ICkgKSB7XG5cdFx0XHRcdC8vIFJlbWVtYmVyIHRoZSBvcmlnaW5hbCB2YWx1ZXNcblx0XHRcdFx0dmFyIGxlZnQgPSBzdHlsZS5sZWZ0LCByc0xlZnQgPSBlbGVtLnJ1bnRpbWVTdHlsZS5sZWZ0O1xuXG5cdFx0XHRcdC8vIFB1dCBpbiB0aGUgbmV3IHZhbHVlcyB0byBnZXQgYSBjb21wdXRlZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRcblx0XHRcdFx0ZWxlbS5ydW50aW1lU3R5bGUubGVmdCA9IGVsZW0uY3VycmVudFN0eWxlLmxlZnQ7XG5cdFx0XHRcdHN0eWxlLmxlZnQgPSBjYW1lbENhc2UgPT09IFwiZm9udFNpemVcIiA/IFwiMWVtXCIgOiAocmV0IHx8IDApO1xuXHRcdFx0XHRyZXQgPSBzdHlsZS5waXhlbExlZnQgKyBcInB4XCI7XG5cblx0XHRcdFx0Ly8gUmV2ZXJ0IHRoZSBjaGFuZ2VkIHZhbHVlc1xuXHRcdFx0XHRzdHlsZS5sZWZ0ID0gbGVmdDtcblx0XHRcdFx0ZWxlbS5ydW50aW1lU3R5bGUubGVmdCA9IHJzTGVmdDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdC8vIEEgbWV0aG9kIGZvciBxdWlja2x5IHN3YXBwaW5nIGluL291dCBDU1MgcHJvcGVydGllcyB0byBnZXQgY29ycmVjdFxuICAgICAgICAvLyBjYWxjdWxhdGlvbnNcblx0c3dhcDogZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIGNhbGxiYWNrICkge1xuXHRcdHZhciBvbGQgPSB7fTtcblxuXHRcdC8vIFJlbWVtYmVyIHRoZSBvbGQgdmFsdWVzLCBhbmQgaW5zZXJ0IHRoZSBuZXcgb25lc1xuXHRcdGZvciAoIHZhciBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRvbGRbIG5hbWUgXSA9IGVsZW0uc3R5bGVbIG5hbWUgXTtcblx0XHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IG9wdGlvbnNbIG5hbWUgXTtcblx0XHR9XG5cblx0XHRjYWxsYmFjay5jYWxsKCBlbGVtICk7XG5cblx0XHQvLyBSZXZlcnQgdGhlIG9sZCB2YWx1ZXNcblx0XHRmb3IgKCB2YXIgbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdFx0ZWxlbS5zdHlsZVsgbmFtZSBdID0gb2xkWyBuYW1lIF07XG5cdFx0fVxuXHR9XG59KTtcblxuaWYgKCBqUXVlcnkuZXhwciAmJiBqUXVlcnkuZXhwci5maWx0ZXJzICkge1xuXHRqUXVlcnkuZXhwci5maWx0ZXJzLmhpZGRlbiA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciB3aWR0aCA9IGVsZW0ub2Zmc2V0V2lkdGgsIGhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0c2tpcCA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0clwiO1xuXG5cdFx0cmV0dXJuIHdpZHRoID09PSAwICYmIGhlaWdodCA9PT0gMCAmJiAhc2tpcCA/XG5cdFx0XHR0cnVlIDpcblx0XHRcdHdpZHRoID4gMCAmJiBoZWlnaHQgPiAwICYmICFza2lwID9cblx0XHRcdFx0ZmFsc2UgOlxuXHRcdFx0XHRqUXVlcnkuY3VyQ1NTKGVsZW0sIFwiZGlzcGxheVwiKSA9PT0gXCJub25lXCI7XG5cdH07XG5cblx0alF1ZXJ5LmV4cHIuZmlsdGVycy52aXNpYmxlID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuICFqUXVlcnkuZXhwci5maWx0ZXJzLmhpZGRlbiggZWxlbSApO1xuXHR9O1xufVxudmFyIGpzYyA9IG5vdygpLFxuXHRyc2NyaXB0ID0gLzxzY3JpcHQoLnxcXHMpKj9cXC9zY3JpcHQ+L2dpLFxuXHRyc2VsZWN0VGV4dGFyZWEgPSAvc2VsZWN0fHRleHRhcmVhL2ksXG5cdHJpbnB1dCA9IC9jb2xvcnxkYXRlfGRhdGV0aW1lfGVtYWlsfGhpZGRlbnxtb250aHxudW1iZXJ8cGFzc3dvcmR8cmFuZ2V8c2VhcmNofHRlbHx0ZXh0fHRpbWV8dXJsfHdlZWsvaSxcblx0anNyZSA9IC89XFw/KCZ8JCkvLFxuXHRycXVlcnkgPSAvXFw/Lyxcblx0cnRzID0gLyhcXD98JilfPS4qPygmfCQpLyxcblx0cnVybCA9IC9eKFxcdys6KT9cXC9cXC8oW15cXC8/I10rKS8sXG5cdHIyMCA9IC8lMjAvZyxcblxuXHQvLyBLZWVwIGEgY29weSBvZiB0aGUgb2xkIGxvYWQgbWV0aG9kXG5cdF9sb2FkID0galF1ZXJ5LmZuLmxvYWQ7XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRsb2FkOiBmdW5jdGlvbiggdXJsLCBwYXJhbXMsIGNhbGxiYWNrICkge1xuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBfbG9hZC5jYWxsKCB0aGlzLCB1cmwgKTtcblxuXHRcdC8vIERvbid0IGRvIGEgcmVxdWVzdCBpZiBubyBlbGVtZW50cyBhcmUgYmVpbmcgcmVxdWVzdGVkXG5cdFx0fSBlbHNlIGlmICggIXRoaXMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0dmFyIG9mZiA9IHVybC5pbmRleE9mKFwiIFwiKTtcblx0XHRpZiAoIG9mZiA+PSAwICkge1xuXHRcdFx0dmFyIHNlbGVjdG9yID0gdXJsLnNsaWNlKG9mZiwgdXJsLmxlbmd0aCk7XG5cdFx0XHR1cmwgPSB1cmwuc2xpY2UoMCwgb2ZmKTtcblx0XHR9XG5cblx0XHQvLyBEZWZhdWx0IHRvIGEgR0VUIHJlcXVlc3Rcblx0XHR2YXIgdHlwZSA9IFwiR0VUXCI7XG5cblx0XHQvLyBJZiB0aGUgc2Vjb25kIHBhcmFtZXRlciB3YXMgcHJvdmlkZWRcblx0XHRpZiAoIHBhcmFtcyApIHtcblx0XHRcdC8vIElmIGl0J3MgYSBmdW5jdGlvblxuXHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggcGFyYW1zICkgKSB7XG5cdFx0XHRcdC8vIFdlIGFzc3VtZSB0aGF0IGl0J3MgdGhlIGNhbGxiYWNrXG5cdFx0XHRcdGNhbGxiYWNrID0gcGFyYW1zO1xuXHRcdFx0XHRwYXJhbXMgPSBudWxsO1xuXG5cdFx0XHQvLyBPdGhlcndpc2UsIGJ1aWxkIGEgcGFyYW0gc3RyaW5nXG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0XHRwYXJhbXMgPSBqUXVlcnkucGFyYW0oIHBhcmFtcywgalF1ZXJ5LmFqYXhTZXR0aW5ncy50cmFkaXRpb25hbCApO1xuXHRcdFx0XHR0eXBlID0gXCJQT1NUXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gUmVxdWVzdCB0aGUgcmVtb3RlIGRvY3VtZW50XG5cdFx0alF1ZXJ5LmFqYXgoe1xuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0ZGF0YVR5cGU6IFwiaHRtbFwiLFxuXHRcdFx0ZGF0YTogcGFyYW1zLFxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKCByZXMsIHN0YXR1cyApIHtcblx0XHRcdFx0Ly8gSWYgc3VjY2Vzc2Z1bCwgaW5qZWN0IHRoZSBIVE1MIGludG8gYWxsIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaGVkIGVsZW1lbnRzXG5cdFx0XHRcdGlmICggc3RhdHVzID09PSBcInN1Y2Nlc3NcIiB8fCBzdGF0dXMgPT09IFwibm90bW9kaWZpZWRcIiApIHtcblx0XHRcdFx0XHQvLyBTZWUgaWYgYSBzZWxlY3RvciB3YXMgc3BlY2lmaWVkXG5cdFx0XHRcdFx0c2VsZi5odG1sKCBzZWxlY3RvciA/XG5cdFx0XHRcdFx0XHQvLyBDcmVhdGUgYSBkdW1teSBkaXYgdG8gaG9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc3VsdHNcblx0XHRcdFx0XHRcdGpRdWVyeShcIjxkaXYgLz5cIilcblx0XHRcdFx0XHRcdFx0Ly8gaW5qZWN0IHRoZSBjb250ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZiB0aGUgZG9jdW1lbnQgaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBzY3JpcHRzXG5cdFx0XHRcdFx0XHRcdC8vIHRvIGF2b2lkIGFueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnUGVybWlzc2lvbiBEZW5pZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVycm9ycyBpbiBJRVxuXHRcdFx0XHRcdFx0XHQuYXBwZW5kKHJlcy5yZXNwb25zZVRleHQucmVwbGFjZShyc2NyaXB0LCBcIlwiKSlcblxuXHRcdFx0XHRcdFx0XHQvLyBMb2NhdGUgdGhlIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHQuZmluZChzZWxlY3RvcikgOlxuXG5cdFx0XHRcdFx0XHQvLyBJZiBub3QsIGp1c3QgaW5qZWN0IHRoZSBmdWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRcblx0XHRcdFx0XHRcdHJlcy5yZXNwb25zZVRleHQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0c2VsZi5lYWNoKCBjYWxsYmFjaywgW3Jlcy5yZXNwb25zZVRleHQsIHN0YXR1cywgcmVzXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRzZXJpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBqUXVlcnkucGFyYW0odGhpcy5zZXJpYWxpemVBcnJheSgpKTtcblx0fSxcblx0c2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmVsZW1lbnRzID8galF1ZXJ5Lm1ha2VBcnJheSh0aGlzLmVsZW1lbnRzKSA6IHRoaXM7XG5cdFx0fSlcblx0XHQuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubmFtZSAmJiAhdGhpcy5kaXNhYmxlZCAmJlxuXHRcdFx0XHQodGhpcy5jaGVja2VkIHx8IHJzZWxlY3RUZXh0YXJlYS50ZXN0KHRoaXMubm9kZU5hbWUpIHx8XG5cdFx0XHRcdFx0cmlucHV0LnRlc3QodGhpcy50eXBlKSk7XG5cdFx0fSlcblx0XHQubWFwKGZ1bmN0aW9uKCBpLCBlbGVtICkge1xuXHRcdFx0dmFyIHZhbCA9IGpRdWVyeSh0aGlzKS52YWwoKTtcblxuXHRcdFx0cmV0dXJuIHZhbCA9PSBudWxsID9cblx0XHRcdFx0bnVsbCA6XG5cdFx0XHRcdGpRdWVyeS5pc0FycmF5KHZhbCkgP1xuXHRcdFx0XHRcdGpRdWVyeS5tYXAoIHZhbCwgZnVuY3Rpb24oIHZhbCwgaSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB7IG5hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbCB9O1xuXHRcdFx0XHRcdH0pIDpcblx0XHRcdFx0XHR7IG5hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbCB9O1xuXHRcdH0pLmdldCgpO1xuXHR9XG59KTtcblxuLy8gQXR0YWNoIGEgYnVuY2ggb2YgZnVuY3Rpb25zIGZvciBoYW5kbGluZyBjb21tb24gQUpBWCBldmVudHNcbmpRdWVyeS5lYWNoKCBcImFqYXhTdGFydCBhamF4U3RvcCBhamF4Q29tcGxldGUgYWpheEVycm9yIGFqYXhTdWNjZXNzIGFqYXhTZW5kXCIuc3BsaXQoXCIgXCIpLCBmdW5jdGlvbiggaSwgbyApIHtcblx0alF1ZXJ5LmZuW29dID0gZnVuY3Rpb24oIGYgKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmluZChvLCBmKTtcblx0fTtcbn0pO1xuXG5qUXVlcnkuZXh0ZW5kKHtcblxuXHRnZXQ6IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrLCB0eXBlICkge1xuXHRcdC8vIHNoaWZ0IGFyZ3VtZW50cyBpZiBkYXRhIGFyZ3VtZW50IHdhcyBvbWl0ZWRcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XG5cdFx0XHR0eXBlID0gdHlwZSB8fCBjYWxsYmFjaztcblx0XHRcdGNhbGxiYWNrID0gZGF0YTtcblx0XHRcdGRhdGEgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkuYWpheCh7XG5cdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c3VjY2VzczogY2FsbGJhY2ssXG5cdFx0XHRkYXRhVHlwZTogdHlwZVxuXHRcdH0pO1xuXHR9LFxuXG5cdGdldFNjcmlwdDogZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5nZXQodXJsLCBudWxsLCBjYWxsYmFjaywgXCJzY3JpcHRcIik7XG5cdH0sXG5cblx0Z2V0SlNPTjogZnVuY3Rpb24oIHVybCwgZGF0YSwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5nZXQodXJsLCBkYXRhLCBjYWxsYmFjaywgXCJqc29uXCIpO1xuXHR9LFxuXG5cdHBvc3Q6IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrLCB0eXBlICkge1xuXHRcdC8vIHNoaWZ0IGFyZ3VtZW50cyBpZiBkYXRhIGFyZ3VtZW50IHdhcyBvbWl0ZWRcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XG5cdFx0XHR0eXBlID0gdHlwZSB8fCBjYWxsYmFjaztcblx0XHRcdGNhbGxiYWNrID0gZGF0YTtcblx0XHRcdGRhdGEgPSB7fTtcblx0XHR9XG5cblx0XHRyZXR1cm4galF1ZXJ5LmFqYXgoe1xuXHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzdWNjZXNzOiBjYWxsYmFjayxcblx0XHRcdGRhdGFUeXBlOiB0eXBlXG5cdFx0fSk7XG5cdH0sXG5cblx0YWpheFNldHVwOiBmdW5jdGlvbiggc2V0dGluZ3MgKSB7XG5cdFx0alF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmFqYXhTZXR0aW5ncywgc2V0dGluZ3MgKTtcblx0fSxcblxuXHRhamF4U2V0dGluZ3M6IHtcblx0XHR1cmw6IGxvY2F0aW9uLmhyZWYsXG5cdFx0Z2xvYmFsOiB0cnVlLFxuXHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0Y29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG5cdFx0cHJvY2Vzc0RhdGE6IHRydWUsXG5cdFx0YXN5bmM6IHRydWUsXG5cdFx0LypcbiAgICAgICAgICAgICAgICAgKiB0aW1lb3V0OiAwLCBkYXRhOiBudWxsLCB1c2VybmFtZTogbnVsbCwgcGFzc3dvcmQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICogdHJhZGl0aW9uYWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAqL1xuXHRcdC8vIENyZWF0ZSB0aGUgcmVxdWVzdCBvYmplY3Q7IE1pY3Jvc29mdCBmYWlsZWQgdG8gcHJvcGVybHlcblx0XHQvLyBpbXBsZW1lbnQgdGhlIFhNTEh0dHBSZXF1ZXN0IGluIElFNyAoY2FuJ3QgcmVxdWVzdCBsb2NhbFxuICAgICAgICAgICAgICAgIC8vIGZpbGVzKSxcblx0XHQvLyBzbyB3ZSB1c2UgdGhlIEFjdGl2ZVhPYmplY3Qgd2hlbiBpdCBpcyBhdmFpbGFibGVcblx0XHQvLyBUaGlzIGZ1bmN0aW9uIGNhbiBiZSBvdmVycmlkZW4gYnkgY2FsbGluZyBqUXVlcnkuYWpheFNldHVwXG5cdFx0eGhyOiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgJiYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCAhPT0gXCJmaWxlOlwiIHx8ICF3aW5kb3cuQWN0aXZlWE9iamVjdCkgP1xuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHR9IDpcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcblx0XHRcdFx0fSBjYXRjaChlKSB7fVxuXHRcdFx0fSxcblx0XHRhY2NlcHRzOiB7XG5cdFx0XHR4bWw6IFwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLFxuXHRcdFx0aHRtbDogXCJ0ZXh0L2h0bWxcIixcblx0XHRcdHNjcmlwdDogXCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIixcblx0XHRcdGpzb246IFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0XCIsXG5cdFx0XHR0ZXh0OiBcInRleHQvcGxhaW5cIixcblx0XHRcdF9kZWZhdWx0OiBcIiovKlwiXG5cdFx0fVxuXHR9LFxuXG5cdC8vIExhc3QtTW9kaWZpZWQgaGVhZGVyIGNhY2hlIGZvciBuZXh0IHJlcXVlc3Rcblx0bGFzdE1vZGlmaWVkOiB7fSxcblx0ZXRhZzoge30sXG5cblx0YWpheDogZnVuY3Rpb24oIG9yaWdTZXR0aW5ncyApIHtcblx0XHR2YXIgcyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIGpRdWVyeS5hamF4U2V0dGluZ3MsIG9yaWdTZXR0aW5ncyk7XG5cdFx0XG5cdFx0dmFyIGpzb25wLCBzdGF0dXMsIGRhdGEsXG5cdFx0XHRjYWxsYmFja0NvbnRleHQgPSBvcmlnU2V0dGluZ3MgJiYgb3JpZ1NldHRpbmdzLmNvbnRleHQgfHwgcyxcblx0XHRcdHR5cGUgPSBzLnR5cGUudG9VcHBlckNhc2UoKTtcblxuXHRcdC8vIGNvbnZlcnQgZGF0YSBpZiBub3QgYWxyZWFkeSBhIHN0cmluZ1xuXHRcdGlmICggcy5kYXRhICYmIHMucHJvY2Vzc0RhdGEgJiYgdHlwZW9mIHMuZGF0YSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHMuZGF0YSA9IGpRdWVyeS5wYXJhbSggcy5kYXRhLCBzLnRyYWRpdGlvbmFsICk7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIEpTT05QIFBhcmFtZXRlciBDYWxsYmFja3Ncblx0XHRpZiAoIHMuZGF0YVR5cGUgPT09IFwianNvbnBcIiApIHtcblx0XHRcdGlmICggdHlwZSA9PT0gXCJHRVRcIiApIHtcblx0XHRcdFx0aWYgKCAhanNyZS50ZXN0KCBzLnVybCApICkge1xuXHRcdFx0XHRcdHMudXJsICs9IChycXVlcnkudGVzdCggcy51cmwgKSA/IFwiJlwiIDogXCI/XCIpICsgKHMuanNvbnAgfHwgXCJjYWxsYmFja1wiKSArIFwiPT9cIjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggIXMuZGF0YSB8fCAhanNyZS50ZXN0KHMuZGF0YSkgKSB7XG5cdFx0XHRcdHMuZGF0YSA9IChzLmRhdGEgPyBzLmRhdGEgKyBcIiZcIiA6IFwiXCIpICsgKHMuanNvbnAgfHwgXCJjYWxsYmFja1wiKSArIFwiPT9cIjtcblx0XHRcdH1cblx0XHRcdHMuZGF0YVR5cGUgPSBcImpzb25cIjtcblx0XHR9XG5cblx0XHQvLyBCdWlsZCB0ZW1wb3JhcnkgSlNPTlAgZnVuY3Rpb25cblx0XHRpZiAoIHMuZGF0YVR5cGUgPT09IFwianNvblwiICYmIChzLmRhdGEgJiYganNyZS50ZXN0KHMuZGF0YSkgfHwganNyZS50ZXN0KHMudXJsKSkgKSB7XG5cdFx0XHRqc29ucCA9IHMuanNvbnBDYWxsYmFjayB8fCAoXCJqc29ucFwiICsganNjKyspO1xuXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSA9PyBzZXF1ZW5jZSBib3RoIGluIHRoZSBxdWVyeSBzdHJpbmcgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGF0YVxuXHRcdFx0aWYgKCBzLmRhdGEgKSB7XG5cdFx0XHRcdHMuZGF0YSA9IChzLmRhdGEgKyBcIlwiKS5yZXBsYWNlKGpzcmUsIFwiPVwiICsganNvbnAgKyBcIiQxXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRzLnVybCA9IHMudXJsLnJlcGxhY2UoanNyZSwgXCI9XCIgKyBqc29ucCArIFwiJDFcIik7XG5cblx0XHRcdC8vIFdlIG5lZWQgdG8gbWFrZSBzdXJlXG5cdFx0XHQvLyB0aGF0IGEgSlNPTlAgc3R5bGUgcmVzcG9uc2UgaXMgZXhlY3V0ZWQgcHJvcGVybHlcblx0XHRcdHMuZGF0YVR5cGUgPSBcInNjcmlwdFwiO1xuXG5cdFx0XHQvLyBIYW5kbGUgSlNPTlAtc3R5bGUgbG9hZGluZ1xuXHRcdFx0d2luZG93WyBqc29ucCBdID0gd2luZG93WyBqc29ucCBdIHx8IGZ1bmN0aW9uKCB0bXAgKSB7XG5cdFx0XHRcdGRhdGEgPSB0bXA7XG5cdFx0XHRcdHN1Y2Nlc3MoKTtcblx0XHRcdFx0Y29tcGxldGUoKTtcblx0XHRcdFx0Ly8gR2FyYmFnZSBjb2xsZWN0XG5cdFx0XHRcdHdpbmRvd1sganNvbnAgXSA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGRlbGV0ZSB3aW5kb3dbIGpzb25wIF07XG5cdFx0XHRcdH0gY2F0Y2goZSkge31cblxuXHRcdFx0XHRpZiAoIGhlYWQgKSB7XG5cdFx0XHRcdFx0aGVhZC5yZW1vdmVDaGlsZCggc2NyaXB0ICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKCBzLmRhdGFUeXBlID09PSBcInNjcmlwdFwiICYmIHMuY2FjaGUgPT09IG51bGwgKSB7XG5cdFx0XHRzLmNhY2hlID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKCBzLmNhY2hlID09PSBmYWxzZSAmJiB0eXBlID09PSBcIkdFVFwiICkge1xuXHRcdFx0dmFyIHRzID0gbm93KCk7XG5cblx0XHRcdC8vIHRyeSByZXBsYWNpbmcgXz0gaWYgaXQgaXMgdGhlcmVcblx0XHRcdHZhciByZXQgPSBzLnVybC5yZXBsYWNlKHJ0cywgXCIkMV89XCIgKyB0cyArIFwiJDJcIik7XG5cblx0XHRcdC8vIGlmIG5vdGhpbmcgd2FzIHJlcGxhY2VkLCBhZGQgdGltZXN0YW1wIHRvIHRoZSBlbmRcblx0XHRcdHMudXJsID0gcmV0ICsgKChyZXQgPT09IHMudXJsKSA/IChycXVlcnkudGVzdChzLnVybCkgPyBcIiZcIiA6IFwiP1wiKSArIFwiXz1cIiArIHRzIDogXCJcIik7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgZGF0YSBpcyBhdmFpbGFibGUsIGFwcGVuZCBkYXRhIHRvIHVybCBmb3IgZ2V0IHJlcXVlc3RzXG5cdFx0aWYgKCBzLmRhdGEgJiYgdHlwZSA9PT0gXCJHRVRcIiApIHtcblx0XHRcdHMudXJsICs9IChycXVlcnkudGVzdChzLnVybCkgPyBcIiZcIiA6IFwiP1wiKSArIHMuZGF0YTtcblx0XHR9XG5cblx0XHQvLyBXYXRjaCBmb3IgYSBuZXcgc2V0IG9mIHJlcXVlc3RzXG5cdFx0aWYgKCBzLmdsb2JhbCAmJiAhIGpRdWVyeS5hY3RpdmUrKyApIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBcImFqYXhTdGFydFwiICk7XG5cdFx0fVxuXG5cdFx0Ly8gTWF0Y2hlcyBhbiBhYnNvbHV0ZSBVUkwsIGFuZCBzYXZlcyB0aGUgZG9tYWluXG5cdFx0dmFyIHBhcnRzID0gcnVybC5leGVjKCBzLnVybCApLFxuXHRcdFx0cmVtb3RlID0gcGFydHMgJiYgKHBhcnRzWzFdICYmIHBhcnRzWzFdICE9PSBsb2NhdGlvbi5wcm90b2NvbCB8fCBwYXJ0c1syXSAhPT0gbG9jYXRpb24uaG9zdCk7XG5cblx0XHQvLyBJZiB3ZSdyZSByZXF1ZXN0aW5nIGEgcmVtb3RlIGRvY3VtZW50XG5cdFx0Ly8gYW5kIHRyeWluZyB0byBsb2FkIEpTT04gb3IgU2NyaXB0IHdpdGggYSBHRVRcblx0XHRpZiAoIHMuZGF0YVR5cGUgPT09IFwic2NyaXB0XCIgJiYgdHlwZSA9PT0gXCJHRVRcIiAmJiByZW1vdGUgKSB7XG5cdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcblx0XHRcdHNjcmlwdC5zcmMgPSBzLnVybDtcblx0XHRcdGlmICggcy5zY3JpcHRDaGFyc2V0ICkge1xuXHRcdFx0XHRzY3JpcHQuY2hhcnNldCA9IHMuc2NyaXB0Q2hhcnNldDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGFuZGxlIFNjcmlwdCBsb2FkaW5nXG5cdFx0XHRpZiAoICFqc29ucCApIHtcblx0XHRcdFx0dmFyIGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyBBdHRhY2ggaGFuZGxlcnMgZm9yIGFsbCBicm93c2Vyc1xuXHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggIWRvbmUgJiYgKCF0aGlzLnJlYWR5U3RhdGUgfHxcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWFkeVN0YXRlID09PSBcImxvYWRlZFwiIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSApIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0c3VjY2VzcygpO1xuXHRcdFx0XHRcdFx0Y29tcGxldGUoKTtcblxuXHRcdFx0XHRcdFx0Ly8gSGFuZGxlIG1lbW9yeSBsZWFrIGluIElFXG5cdFx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdFx0XHRpZiAoIGhlYWQgJiYgc2NyaXB0LnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoIHNjcmlwdCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuIElFNiBidWcuXG5cdFx0XHQvLyBUaGlzIGFyaXNlcyB3aGVuIGEgYmFzZSBub2RlIGlzIHVzZWQgKCMyNzA5IGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIzQzNzgpLlxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoIHNjcmlwdCwgaGVhZC5maXJzdENoaWxkICk7XG5cblx0XHRcdC8vIFdlIGhhbmRsZSBldmVyeXRoaW5nIHVzaW5nIHRoZSBzY3JpcHQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5qZWN0aW9uXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHZhciByZXF1ZXN0RG9uZSA9IGZhbHNlO1xuXG5cdFx0Ly8gQ3JlYXRlIHRoZSByZXF1ZXN0IG9iamVjdFxuXHRcdHZhciB4aHIgPSBzLnhocigpO1xuXG5cdFx0aWYgKCAheGhyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIE9wZW4gdGhlIHNvY2tldFxuXHRcdC8vIFBhc3NpbmcgbnVsbCB1c2VybmFtZSwgZ2VuZXJhdGVzIGEgbG9naW4gcG9wdXAgb24gT3BlcmFcbiAgICAgICAgICAgICAgICAvLyAoIzI4NjUpXG5cdFx0aWYgKCBzLnVzZXJuYW1lICkge1xuXHRcdFx0eGhyLm9wZW4odHlwZSwgcy51cmwsIHMuYXN5bmMsIHMudXNlcm5hbWUsIHMucGFzc3dvcmQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR4aHIub3Blbih0eXBlLCBzLnVybCwgcy5hc3luYyk7XG5cdFx0fVxuXG5cdFx0Ly8gTmVlZCBhbiBleHRyYSB0cnkvY2F0Y2ggZm9yIGNyb3NzIGRvbWFpbiByZXF1ZXN0cyBpbiBGaXJlZm94XG4gICAgICAgICAgICAgICAgLy8gM1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBTZXQgdGhlIGNvcnJlY3QgaGVhZGVyLCBpZiBkYXRhIGlzIGJlaW5nIHNlbnRcblx0XHRcdGlmICggcy5kYXRhIHx8IG9yaWdTZXR0aW5ncyAmJiBvcmlnU2V0dGluZ3MuY29udGVudFR5cGUgKSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIHMuY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoZWFkZXIsIGlmIGluIGlmTW9kaWZpZWQgbW9kZS5cblx0XHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0XHRpZiAoIGpRdWVyeS5sYXN0TW9kaWZpZWRbcy51cmxdICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIiwgalF1ZXJ5Lmxhc3RNb2RpZmllZFtzLnVybF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBqUXVlcnkuZXRhZ1tzLnVybF0gKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIsIGpRdWVyeS5ldGFnW3MudXJsXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGhlYWRlciBzbyB0aGUgY2FsbGVkIHNjcmlwdCBrbm93cyB0aGF0IGl0J3MgYW5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhNTEh0dHBSZXF1ZXN0XG5cdFx0XHQvLyBPbmx5IHNlbmQgdGhlIGhlYWRlciBpZiBpdCdzIG5vdCBhIHJlbW90ZSBYSFJcblx0XHRcdGlmICggIXJlbW90ZSApIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgQWNjZXB0cyBoZWFkZXIgZm9yIHRoZSBzZXJ2ZXIsIGRlcGVuZGluZyBvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRhdGFUeXBlXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBzLmRhdGFUeXBlICYmIHMuYWNjZXB0c1sgcy5kYXRhVHlwZSBdID9cblx0XHRcdFx0cy5hY2NlcHRzWyBzLmRhdGFUeXBlIF0gKyBcIiwgKi8qXCIgOlxuXHRcdFx0XHRzLmFjY2VwdHMuX2RlZmF1bHQgKTtcblx0XHR9IGNhdGNoKGUpIHt9XG5cblx0XHQvLyBBbGxvdyBjdXN0b20gaGVhZGVycy9taW1ldHlwZXMgYW5kIGVhcmx5IGFib3J0XG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgJiYgcy5iZWZvcmVTZW5kLmNhbGwoY2FsbGJhY2tDb250ZXh0LCB4aHIsIHMpID09PSBmYWxzZSApIHtcblx0XHRcdC8vIEhhbmRsZSB0aGUgZ2xvYmFsIEFKQVggY291bnRlclxuXHRcdFx0aWYgKCBzLmdsb2JhbCAmJiAhIC0talF1ZXJ5LmFjdGl2ZSApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIFwiYWpheFN0b3BcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjbG9zZSBvcGVuZGVkIHNvY2tldFxuXHRcdFx0eGhyLmFib3J0KCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKCBzLmdsb2JhbCApIHtcblx0XHRcdHRyaWdnZXIoXCJhamF4U2VuZFwiLCBbeGhyLCBzXSk7XG5cdFx0fVxuXG5cdFx0Ly8gV2FpdCBmb3IgYSByZXNwb25zZSB0byBjb21lIGJhY2tcblx0XHR2YXIgb25yZWFkeXN0YXRlY2hhbmdlID0geGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCBpc1RpbWVvdXQgKSB7XG5cdFx0XHQvLyBUaGUgcmVxdWVzdCB3YXMgYWJvcnRlZFxuXHRcdFx0aWYgKCAheGhyIHx8IHhoci5yZWFkeVN0YXRlID09PSAwIHx8IGlzVGltZW91dCA9PT0gXCJhYm9ydFwiICkge1xuXHRcdFx0XHQvLyBPcGVyYSBkb2Vzbid0IGNhbGwgb25yZWFkeXN0YXRlY2hhbmdlIGJlZm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHBvaW50XG5cdFx0XHRcdC8vIHNvIHdlIHNpbXVsYXRlIHRoZSBjYWxsXG5cdFx0XHRcdGlmICggIXJlcXVlc3REb25lICkge1xuXHRcdFx0XHRcdGNvbXBsZXRlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXF1ZXN0RG9uZSA9IHRydWU7XG5cdFx0XHRcdGlmICggeGhyICkge1xuXHRcdFx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBqUXVlcnkubm9vcDtcblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBUaGUgdHJhbnNmZXIgaXMgY29tcGxldGUgYW5kIHRoZSBkYXRhIGlzIGF2YWlsYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIHRoZSByZXF1ZXN0IHRpbWVkIG91dFxuXHRcdFx0fSBlbHNlIGlmICggIXJlcXVlc3REb25lICYmIHhociAmJiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgfHwgaXNUaW1lb3V0ID09PSBcInRpbWVvdXRcIikgKSB7XG5cdFx0XHRcdHJlcXVlc3REb25lID0gdHJ1ZTtcblx0XHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGpRdWVyeS5ub29wO1xuXG5cdFx0XHRcdHN0YXR1cyA9IGlzVGltZW91dCA9PT0gXCJ0aW1lb3V0XCIgP1xuXHRcdFx0XHRcdFwidGltZW91dFwiIDpcblx0XHRcdFx0XHQhalF1ZXJ5Lmh0dHBTdWNjZXNzKCB4aHIgKSA/XG5cdFx0XHRcdFx0XHRcImVycm9yXCIgOlxuXHRcdFx0XHRcdFx0cy5pZk1vZGlmaWVkICYmIGpRdWVyeS5odHRwTm90TW9kaWZpZWQoIHhociwgcy51cmwgKSA/XG5cdFx0XHRcdFx0XHRcdFwibm90bW9kaWZpZWRcIiA6XG5cdFx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiO1xuXG5cdFx0XHRcdHZhciBlcnJNc2c7XG5cblx0XHRcdFx0aWYgKCBzdGF0dXMgPT09IFwic3VjY2Vzc1wiICkge1xuXHRcdFx0XHRcdC8vIFdhdGNoIGZvciwgYW5kIGNhdGNoLCBYTUwgZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSBlcnJvcnNcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Ly8gcHJvY2VzcyB0aGUgZGF0YSAocnVucyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHhtbCB0aHJvdWdoIGh0dHBEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWdhcmRsZXNzIG9mIGNhbGxiYWNrKVxuXHRcdFx0XHRcdFx0ZGF0YSA9IGpRdWVyeS5odHRwRGF0YSggeGhyLCBzLmRhdGFUeXBlLCBzICk7XG5cdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcblx0XHRcdFx0XHRcdHN0YXR1cyA9IFwicGFyc2VyZXJyb3JcIjtcblx0XHRcdFx0XHRcdGVyck1zZyA9IGVycjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcmVxdWVzdCB3YXMgc3VjY2Vzc2Z1bCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBub3Rtb2RpZmllZFxuXHRcdFx0XHRpZiAoIHN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgfHwgc3RhdHVzID09PSBcIm5vdG1vZGlmaWVkXCIgKSB7XG5cdFx0XHRcdFx0Ly8gSlNPTlAgaGFuZGxlcyBpdHMgb3duIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFja1xuXHRcdFx0XHRcdGlmICggIWpzb25wICkge1xuXHRcdFx0XHRcdFx0c3VjY2VzcygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRqUXVlcnkuaGFuZGxlRXJyb3IocywgeGhyLCBzdGF0dXMsIGVyck1zZyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGaXJlIHRoZSBjb21wbGV0ZSBoYW5kbGVyc1xuXHRcdFx0XHRjb21wbGV0ZSgpO1xuXG5cdFx0XHRcdGlmICggaXNUaW1lb3V0ID09PSBcInRpbWVvdXRcIiApIHtcblx0XHRcdFx0XHR4aHIuYWJvcnQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFN0b3AgbWVtb3J5IGxlYWtzXG5cdFx0XHRcdGlmICggcy5hc3luYyApIHtcblx0XHRcdFx0XHR4aHIgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIE92ZXJyaWRlIHRoZSBhYm9ydCBoYW5kbGVyLCBpZiB3ZSBjYW4gKElFIGRvZXNuJ3QgYWxsb3cgaXQsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHRoYXQncyBPSylcblx0XHQvLyBPcGVyYSBkb2Vzbid0IGZpcmUgb25yZWFkeXN0YXRlY2hhbmdlIGF0IGFsbCBvbiBhYm9ydFxuXHRcdHRyeSB7XG5cdFx0XHR2YXIgb2xkQWJvcnQgPSB4aHIuYWJvcnQ7XG5cdFx0XHR4aHIuYWJvcnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB4aHIgKSB7XG5cdFx0XHRcdFx0b2xkQWJvcnQuY2FsbCggeGhyICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvbnJlYWR5c3RhdGVjaGFuZ2UoIFwiYWJvcnRcIiApO1xuXHRcdFx0fTtcblx0XHR9IGNhdGNoKGUpIHsgfVxuXG5cdFx0Ly8gVGltZW91dCBjaGVja2VyXG5cdFx0aWYgKCBzLmFzeW5jICYmIHMudGltZW91dCA+IDAgKSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIHJlcXVlc3QgaXMgc3RpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFwcGVuaW5nXG5cdFx0XHRcdGlmICggeGhyICYmICFyZXF1ZXN0RG9uZSApIHtcblx0XHRcdFx0XHRvbnJlYWR5c3RhdGVjaGFuZ2UoIFwidGltZW91dFwiICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHMudGltZW91dCk7XG5cdFx0fVxuXG5cdFx0Ly8gU2VuZCB0aGUgZGF0YVxuXHRcdHRyeSB7XG5cdFx0XHR4aHIuc2VuZCggdHlwZSA9PT0gXCJQT1NUXCIgfHwgdHlwZSA9PT0gXCJQVVRcIiB8fCB0eXBlID09PSBcIkRFTEVURVwiID8gcy5kYXRhIDogbnVsbCApO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0alF1ZXJ5LmhhbmRsZUVycm9yKHMsIHhociwgbnVsbCwgZSk7XG5cdFx0XHQvLyBGaXJlIHRoZSBjb21wbGV0ZSBoYW5kbGVyc1xuXHRcdFx0Y29tcGxldGUoKTtcblx0XHR9XG5cblx0XHQvLyBmaXJlZm94IDEuNSBkb2Vzbid0IGZpcmUgc3RhdGVjaGFuZ2UgZm9yIHN5bmMgcmVxdWVzdHNcblx0XHRpZiAoICFzLmFzeW5jICkge1xuXHRcdFx0b25yZWFkeXN0YXRlY2hhbmdlKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0XHRcdC8vIElmIGEgbG9jYWwgY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgZmlyZSBpdCBhbmQgcGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgdGhlIGRhdGFcblx0XHRcdGlmICggcy5zdWNjZXNzICkge1xuXHRcdFx0XHRzLnN1Y2Nlc3MuY2FsbCggY2FsbGJhY2tDb250ZXh0LCBkYXRhLCBzdGF0dXMsIHhociApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGaXJlIHRoZSBnbG9iYWwgY2FsbGJhY2tcblx0XHRcdGlmICggcy5nbG9iYWwgKSB7XG5cdFx0XHRcdHRyaWdnZXIoIFwiYWpheFN1Y2Nlc3NcIiwgW3hociwgc10gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtcblx0XHRcdC8vIFByb2Nlc3MgcmVzdWx0XG5cdFx0XHRpZiAoIHMuY29tcGxldGUgKSB7XG5cdFx0XHRcdHMuY29tcGxldGUuY2FsbCggY2FsbGJhY2tDb250ZXh0LCB4aHIsIHN0YXR1cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRoZSByZXF1ZXN0IHdhcyBjb21wbGV0ZWRcblx0XHRcdGlmICggcy5nbG9iYWwgKSB7XG5cdFx0XHRcdHRyaWdnZXIoIFwiYWpheENvbXBsZXRlXCIsIFt4aHIsIHNdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZ2xvYmFsIEFKQVggY291bnRlclxuXHRcdFx0aWYgKCBzLmdsb2JhbCAmJiAhIC0talF1ZXJ5LmFjdGl2ZSApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIFwiYWpheFN0b3BcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiB0cmlnZ2VyKHR5cGUsIGFyZ3MpIHtcblx0XHRcdChzLmNvbnRleHQgPyBqUXVlcnkocy5jb250ZXh0KSA6IGpRdWVyeS5ldmVudCkudHJpZ2dlcih0eXBlLCBhcmdzKTtcblx0XHR9XG5cblx0XHQvLyByZXR1cm4gWE1MSHR0cFJlcXVlc3QgdG8gYWxsb3cgYWJvcnRpbmcgdGhlIHJlcXVlc3QgZXRjLlxuXHRcdHJldHVybiB4aHI7XG5cdH0sXG5cblx0aGFuZGxlRXJyb3I6IGZ1bmN0aW9uKCBzLCB4aHIsIHN0YXR1cywgZSApIHtcblx0XHQvLyBJZiBhIGxvY2FsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIGZpcmUgaXRcblx0XHRpZiAoIHMuZXJyb3IgKSB7XG5cdFx0XHRzLmVycm9yLmNhbGwoIHMuY29udGV4dCB8fCBzLCB4aHIsIHN0YXR1cywgZSApO1xuXHRcdH1cblxuXHRcdC8vIEZpcmUgdGhlIGdsb2JhbCBjYWxsYmFja1xuXHRcdGlmICggcy5nbG9iYWwgKSB7XG5cdFx0XHQocy5jb250ZXh0ID8galF1ZXJ5KHMuY29udGV4dCkgOiBqUXVlcnkuZXZlbnQpLnRyaWdnZXIoIFwiYWpheEVycm9yXCIsIFt4aHIsIHMsIGVdICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIENvdW50ZXIgZm9yIGhvbGRpbmcgdGhlIG51bWJlciBvZiBhY3RpdmUgcXVlcmllc1xuXHRhY3RpdmU6IDAsXG5cblx0Ly8gRGV0ZXJtaW5lcyBpZiBhbiBYTUxIdHRwUmVxdWVzdCB3YXMgc3VjY2Vzc2Z1bCBvciBub3Rcblx0aHR0cFN1Y2Nlc3M6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIElFIGVycm9yIHNvbWV0aW1lcyByZXR1cm5zIDEyMjMgd2hlbiBpdCBzaG91bGQgYmUgMjA0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB0cmVhdCBpdCBhcyBzdWNjZXNzLCBzZWUgIzE0NTBcblx0XHRcdHJldHVybiAheGhyLnN0YXR1cyAmJiBsb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJmaWxlOlwiIHx8XG5cdFx0XHRcdC8vIE9wZXJhIHJldHVybnMgMCB3aGVuIHN0YXR1cyBpcyAzMDRcblx0XHRcdFx0KCB4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwICkgfHxcblx0XHRcdFx0eGhyLnN0YXR1cyA9PT0gMzA0IHx8IHhoci5zdGF0dXMgPT09IDEyMjMgfHwgeGhyLnN0YXR1cyA9PT0gMDtcblx0XHR9IGNhdGNoKGUpIHt9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0Ly8gRGV0ZXJtaW5lcyBpZiBhbiBYTUxIdHRwUmVxdWVzdCByZXR1cm5zIE5vdE1vZGlmaWVkXG5cdGh0dHBOb3RNb2RpZmllZDogZnVuY3Rpb24oIHhociwgdXJsICkge1xuXHRcdHZhciBsYXN0TW9kaWZpZWQgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJMYXN0LU1vZGlmaWVkXCIpLFxuXHRcdFx0ZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihcIkV0YWdcIik7XG5cblx0XHRpZiAoIGxhc3RNb2RpZmllZCApIHtcblx0XHRcdGpRdWVyeS5sYXN0TW9kaWZpZWRbdXJsXSA9IGxhc3RNb2RpZmllZDtcblx0XHR9XG5cblx0XHRpZiAoIGV0YWcgKSB7XG5cdFx0XHRqUXVlcnkuZXRhZ1t1cmxdID0gZXRhZztcblx0XHR9XG5cblx0XHQvLyBPcGVyYSByZXR1cm5zIDAgd2hlbiBzdGF0dXMgaXMgMzA0XG5cdFx0cmV0dXJuIHhoci5zdGF0dXMgPT09IDMwNCB8fCB4aHIuc3RhdHVzID09PSAwO1xuXHR9LFxuXG5cdGh0dHBEYXRhOiBmdW5jdGlvbiggeGhyLCB0eXBlLCBzICkge1xuXHRcdHZhciBjdCA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiLFxuXHRcdFx0eG1sID0gdHlwZSA9PT0gXCJ4bWxcIiB8fCAhdHlwZSAmJiBjdC5pbmRleE9mKFwieG1sXCIpID49IDAsXG5cdFx0XHRkYXRhID0geG1sID8geGhyLnJlc3BvbnNlWE1MIDogeGhyLnJlc3BvbnNlVGV4dDtcblxuXHRcdGlmICggeG1sICYmIGRhdGEuZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lID09PSBcInBhcnNlcmVycm9yXCIgKSB7XG5cdFx0XHRqUXVlcnkuZXJyb3IoIFwicGFyc2VyZXJyb3JcIiApO1xuXHRcdH1cblxuXHRcdC8vIEFsbG93IGEgcHJlLWZpbHRlcmluZyBmdW5jdGlvbiB0byBzYW5pdGl6ZSB0aGUgcmVzcG9uc2Vcblx0XHQvLyBzIGlzIGNoZWNrZWQgdG8ga2VlcCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHRcdGlmICggcyAmJiBzLmRhdGFGaWx0ZXIgKSB7XG5cdFx0XHRkYXRhID0gcy5kYXRhRmlsdGVyKCBkYXRhLCB0eXBlICk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIGZpbHRlciBjYW4gYWN0dWFsbHkgcGFyc2UgdGhlIHJlc3BvbnNlXG5cdFx0aWYgKCB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdC8vIEdldCB0aGUgSmF2YVNjcmlwdCBvYmplY3QsIGlmIEpTT04gaXMgdXNlZC5cblx0XHRcdGlmICggdHlwZSA9PT0gXCJqc29uXCIgfHwgIXR5cGUgJiYgY3QuaW5kZXhPZihcImpzb25cIikgPj0gMCApIHtcblx0XHRcdFx0ZGF0YSA9IGpRdWVyeS5wYXJzZUpTT04oIGRhdGEgKTtcblxuXHRcdFx0Ly8gSWYgdGhlIHR5cGUgaXMgXCJzY3JpcHRcIiwgZXZhbCBpdCBpbiBnbG9iYWwgY29udGV4dFxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJzY3JpcHRcIiB8fCAhdHlwZSAmJiBjdC5pbmRleE9mKFwiamF2YXNjcmlwdFwiKSA+PSAwICkge1xuXHRcdFx0XHRqUXVlcnkuZ2xvYmFsRXZhbCggZGF0YSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXG5cdC8vIFNlcmlhbGl6ZSBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzIG9yIGEgc2V0IG9mXG5cdC8vIGtleS92YWx1ZXMgaW50byBhIHF1ZXJ5IHN0cmluZ1xuXHRwYXJhbTogZnVuY3Rpb24oIGEsIHRyYWRpdGlvbmFsICkge1xuXHRcdHZhciBzID0gW107XG5cdFx0XG5cdFx0Ly8gU2V0IHRyYWRpdGlvbmFsIHRvIHRydWUgZm9yIGpRdWVyeSA8PSAxLjMuMiBiZWhhdmlvci5cblx0XHRpZiAoIHRyYWRpdGlvbmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0cmFkaXRpb25hbCA9IGpRdWVyeS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWw7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm1cbiAgICAgICAgICAgICAgICAvLyBlbGVtZW50cy5cblx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KGEpIHx8IGEuanF1ZXJ5ICkge1xuXHRcdFx0Ly8gU2VyaWFsaXplIHRoZSBmb3JtIGVsZW1lbnRzXG5cdFx0XHRqUXVlcnkuZWFjaCggYSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFkZCggdGhpcy5uYW1lLCB0aGlzLnZhbHVlICk7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3Igb2xkZXJcblx0XHRcdC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuXHRcdFx0Zm9yICggdmFyIHByZWZpeCBpbiBhICkge1xuXHRcdFx0XHRidWlsZFBhcmFtcyggcHJlZml4LCBhW3ByZWZpeF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZXR1cm4gdGhlIHJlc3VsdGluZyBzZXJpYWxpemF0aW9uXG5cdFx0cmV0dXJuIHMuam9pbihcIiZcIikucmVwbGFjZShyMjAsIFwiK1wiKTtcblxuXHRcdGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKCBwcmVmaXgsIG9iaiApIHtcblx0XHRcdGlmICggalF1ZXJ5LmlzQXJyYXkob2JqKSApIHtcblx0XHRcdFx0Ly8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG5cdFx0XHRcdGpRdWVyeS5lYWNoKCBvYmosIGZ1bmN0aW9uKCBpLCB2ICkge1xuXHRcdFx0XHRcdGlmICggdHJhZGl0aW9uYWwgfHwgL1xcW1xcXSQvLnRlc3QoIHByZWZpeCApICkge1xuXHRcdFx0XHRcdFx0Ly8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNjYWxhci5cblx0XHRcdFx0XHRcdGFkZCggcHJlZml4LCB2ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIElmIGFycmF5IGl0ZW0gaXMgbm9uLXNjYWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKGFycmF5IG9yIG9iamVjdCksIGVuY29kZSBpdHNcblx0XHRcdFx0XHRcdC8vIG51bWVyaWMgaW5kZXggdG8gcmVzb2x2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVzZXJpYWxpemF0aW9uIGFtYmlndWl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXNzdWVzLlxuXHRcdFx0XHRcdFx0Ly8gTm90ZSB0aGF0IHJhY2sgKGFzIG9mIDEuMC4wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgY3VycmVudGx5IGRlc2VyaWFsaXplXG5cdFx0XHRcdFx0XHQvLyBuZXN0ZWQgYXJyYXlzIHByb3Blcmx5LCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0dGVtcHRpbmcgdG8gZG8gc28gbWF5IGNhdXNlXG5cdFx0XHRcdFx0XHQvLyBhIHNlcnZlciBlcnJvci4gUG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVzIGFyZSB0byBtb2RpZnkgcmFjaydzXG5cdFx0XHRcdFx0XHQvLyBkZXNlcmlhbGl6YXRpb24gYWxnb3JpdGhtIG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBwcm92aWRlIGFuIG9wdGlvbiBvciBmbGFnXG5cdFx0XHRcdFx0XHQvLyB0byBmb3JjZSBhcnJheSBzZXJpYWxpemF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBiZSBzaGFsbG93LlxuXHRcdFx0XHRcdFx0YnVpbGRQYXJhbXMoIHByZWZpeCArIFwiW1wiICsgKCB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiB8fCBqUXVlcnkuaXNBcnJheSh2KSA/IGkgOiBcIlwiICkgKyBcIl1cIiwgdiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHR9IGVsc2UgaWYgKCAhdHJhZGl0aW9uYWwgJiYgb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdFx0Ly8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuXHRcdFx0XHRqUXVlcnkuZWFjaCggb2JqLCBmdW5jdGlvbiggaywgdiApIHtcblx0XHRcdFx0XHRidWlsZFBhcmFtcyggcHJlZml4ICsgXCJbXCIgKyBrICsgXCJdXCIsIHYgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG5cdFx0XHRcdGFkZCggcHJlZml4LCBvYmogKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBhZGQoIGtleSwgdmFsdWUgKSB7XG5cdFx0XHQvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlXG5cdFx0XHR2YWx1ZSA9IGpRdWVyeS5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlKCkgOiB2YWx1ZTtcblx0XHRcdHNbIHMubGVuZ3RoIF0gPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0XHR9XG5cdH1cbn0pO1xudmFyIGVsZW1kaXNwbGF5ID0ge30sXG5cdHJmeHR5cGVzID0gL3RvZ2dsZXxzaG93fGhpZGUvLFxuXHRyZnhudW0gPSAvXihbKy1dPSk/KFtcXGQrLS5dKykoLiopJC8sXG5cdHRpbWVySWQsXG5cdGZ4QXR0cnMgPSBbXG5cdFx0Ly8gaGVpZ2h0IGFuaW1hdGlvbnNcblx0XHRbIFwiaGVpZ2h0XCIsIFwibWFyZ2luVG9wXCIsIFwibWFyZ2luQm90dG9tXCIsIFwicGFkZGluZ1RvcFwiLCBcInBhZGRpbmdCb3R0b21cIiBdLFxuXHRcdC8vIHdpZHRoIGFuaW1hdGlvbnNcblx0XHRbIFwid2lkdGhcIiwgXCJtYXJnaW5MZWZ0XCIsIFwibWFyZ2luUmlnaHRcIiwgXCJwYWRkaW5nTGVmdFwiLCBcInBhZGRpbmdSaWdodFwiIF0sXG5cdFx0Ly8gb3BhY2l0eSBhbmltYXRpb25zXG5cdFx0WyBcIm9wYWNpdHlcIiBdXG5cdF07XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRzaG93OiBmdW5jdGlvbiggc3BlZWQsIGNhbGxiYWNrICkge1xuXHRcdGlmICggc3BlZWQgfHwgc3BlZWQgPT09IDApIHtcblx0XHRcdHJldHVybiB0aGlzLmFuaW1hdGUoIGdlbkZ4KFwic2hvd1wiLCAzKSwgc3BlZWQsIGNhbGxiYWNrKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0dmFyIG9sZCA9IGpRdWVyeS5kYXRhKHRoaXNbaV0sIFwib2xkZGlzcGxheVwiKTtcblxuXHRcdFx0XHR0aGlzW2ldLnN0eWxlLmRpc3BsYXkgPSBvbGQgfHwgXCJcIjtcblxuXHRcdFx0XHRpZiAoIGpRdWVyeS5jc3ModGhpc1tpXSwgXCJkaXNwbGF5XCIpID09PSBcIm5vbmVcIiApIHtcblx0XHRcdFx0XHR2YXIgbm9kZU5hbWUgPSB0aGlzW2ldLm5vZGVOYW1lLCBkaXNwbGF5O1xuXG5cdFx0XHRcdFx0aWYgKCBlbGVtZGlzcGxheVsgbm9kZU5hbWUgXSApIHtcblx0XHRcdFx0XHRcdGRpc3BsYXkgPSBlbGVtZGlzcGxheVsgbm9kZU5hbWUgXTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgZWxlbSA9IGpRdWVyeShcIjxcIiArIG5vZGVOYW1lICsgXCIgLz5cIikuYXBwZW5kVG8oXCJib2R5XCIpO1xuXG5cdFx0XHRcdFx0XHRkaXNwbGF5ID0gZWxlbS5jc3MoXCJkaXNwbGF5XCIpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIGRpc3BsYXkgPT09IFwibm9uZVwiICkge1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbGVtLnJlbW92ZSgpO1xuXG5cdFx0XHRcdFx0XHRlbGVtZGlzcGxheVsgbm9kZU5hbWUgXSA9IGRpc3BsYXk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0alF1ZXJ5LmRhdGEodGhpc1tpXSwgXCJvbGRkaXNwbGF5XCIsIGRpc3BsYXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZGlzcGxheSBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZWNvbmQgbG9vcFxuXHRcdFx0Ly8gdG8gYXZvaWQgdGhlIGNvbnN0YW50IHJlZmxvd1xuXHRcdFx0Zm9yICggdmFyIGogPSAwLCBrID0gdGhpcy5sZW5ndGg7IGogPCBrOyBqKysgKSB7XG5cdFx0XHRcdHRoaXNbal0uc3R5bGUuZGlzcGxheSA9IGpRdWVyeS5kYXRhKHRoaXNbal0sIFwib2xkZGlzcGxheVwiKSB8fCBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sXG5cblx0aGlkZTogZnVuY3Rpb24oIHNwZWVkLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIHNwZWVkIHx8IHNwZWVkID09PSAwICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSggZ2VuRngoXCJoaWRlXCIsIDMpLCBzcGVlZCwgY2FsbGJhY2spO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHR2YXIgb2xkID0galF1ZXJ5LmRhdGEodGhpc1tpXSwgXCJvbGRkaXNwbGF5XCIpO1xuXHRcdFx0XHRpZiAoICFvbGQgJiYgb2xkICE9PSBcIm5vbmVcIiApIHtcblx0XHRcdFx0XHRqUXVlcnkuZGF0YSh0aGlzW2ldLCBcIm9sZGRpc3BsYXlcIiwgalF1ZXJ5LmNzcyh0aGlzW2ldLCBcImRpc3BsYXlcIikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZGlzcGxheSBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZWNvbmQgbG9vcFxuXHRcdFx0Ly8gdG8gYXZvaWQgdGhlIGNvbnN0YW50IHJlZmxvd1xuXHRcdFx0Zm9yICggdmFyIGogPSAwLCBrID0gdGhpcy5sZW5ndGg7IGogPCBrOyBqKysgKSB7XG5cdFx0XHRcdHRoaXNbal0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sXG5cblx0Ly8gU2F2ZSB0aGUgb2xkIHRvZ2dsZSBmdW5jdGlvblxuXHRfdG9nZ2xlOiBqUXVlcnkuZm4udG9nZ2xlLFxuXG5cdHRvZ2dsZTogZnVuY3Rpb24oIGZuLCBmbjIgKSB7XG5cdFx0dmFyIGJvb2wgPSB0eXBlb2YgZm4gPT09IFwiYm9vbGVhblwiO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbihmbikgJiYgalF1ZXJ5LmlzRnVuY3Rpb24oZm4yKSApIHtcblx0XHRcdHRoaXMuX3RvZ2dsZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR9IGVsc2UgaWYgKCBmbiA9PSBudWxsIHx8IGJvb2wgKSB7XG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzdGF0ZSA9IGJvb2wgPyBmbiA6IGpRdWVyeSh0aGlzKS5pcyhcIjpoaWRkZW5cIik7XG5cdFx0XHRcdGpRdWVyeSh0aGlzKVsgc3RhdGUgPyBcInNob3dcIiA6IFwiaGlkZVwiIF0oKTtcblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYW5pbWF0ZShnZW5GeChcInRvZ2dsZVwiLCAzKSwgZm4sIGZuMik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZmFkZVRvOiBmdW5jdGlvbiggc3BlZWQsIHRvLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4gdGhpcy5maWx0ZXIoXCI6aGlkZGVuXCIpLmNzcyhcIm9wYWNpdHlcIiwgMCkuc2hvdygpLmVuZCgpXG5cdFx0XHRcdFx0LmFuaW1hdGUoe29wYWNpdHk6IHRvfSwgc3BlZWQsIGNhbGxiYWNrKTtcblx0fSxcblxuXHRhbmltYXRlOiBmdW5jdGlvbiggcHJvcCwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0dmFyIG9wdGFsbCA9IGpRdWVyeS5zcGVlZChzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayk7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0VtcHR5T2JqZWN0KCBwcm9wICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKCBvcHRhbGwuY29tcGxldGUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpc1sgb3B0YWxsLnF1ZXVlID09PSBmYWxzZSA/IFwiZWFjaFwiIDogXCJxdWV1ZVwiIF0oZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3B0ID0galF1ZXJ5LmV4dGVuZCh7fSwgb3B0YWxsKSwgcCxcblx0XHRcdFx0aGlkZGVuID0gdGhpcy5ub2RlVHlwZSA9PT0gMSAmJiBqUXVlcnkodGhpcykuaXMoXCI6aGlkZGVuXCIpLFxuXHRcdFx0XHRzZWxmID0gdGhpcztcblxuXHRcdFx0Zm9yICggcCBpbiBwcm9wICkge1xuXHRcdFx0XHR2YXIgbmFtZSA9IHAucmVwbGFjZShyZGFzaEFscGhhLCBmY2FtZWxDYXNlKTtcblxuXHRcdFx0XHRpZiAoIHAgIT09IG5hbWUgKSB7XG5cdFx0XHRcdFx0cHJvcFsgbmFtZSBdID0gcHJvcFsgcCBdO1xuXHRcdFx0XHRcdGRlbGV0ZSBwcm9wWyBwIF07XG5cdFx0XHRcdFx0cCA9IG5hbWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByb3BbcF0gPT09IFwiaGlkZVwiICYmIGhpZGRlbiB8fCBwcm9wW3BdID09PSBcInNob3dcIiAmJiAhaGlkZGVuICkge1xuXHRcdFx0XHRcdHJldHVybiBvcHQuY29tcGxldGUuY2FsbCh0aGlzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggKCBwID09PSBcImhlaWdodFwiIHx8IHAgPT09IFwid2lkdGhcIiApICYmIHRoaXMuc3R5bGUgKSB7XG5cdFx0XHRcdFx0Ly8gU3RvcmUgZGlzcGxheSBwcm9wZXJ0eVxuXHRcdFx0XHRcdG9wdC5kaXNwbGF5ID0galF1ZXJ5LmNzcyh0aGlzLCBcImRpc3BsYXlcIik7XG5cblx0XHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBub3RoaW5nIHNuZWFrcyBvdXRcblx0XHRcdFx0XHRvcHQub3ZlcmZsb3cgPSB0aGlzLnN0eWxlLm92ZXJmbG93O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggcHJvcFtwXSApICkge1xuXHRcdFx0XHRcdC8vIENyZWF0ZSAoaWYgbmVlZGVkKSBhbmQgYWRkIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbEVhc2luZ1xuXHRcdFx0XHRcdChvcHQuc3BlY2lhbEVhc2luZyA9IG9wdC5zcGVjaWFsRWFzaW5nIHx8IHt9KVtwXSA9IHByb3BbcF1bMV07XG5cdFx0XHRcdFx0cHJvcFtwXSA9IHByb3BbcF1bMF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBvcHQub3ZlcmZsb3cgIT0gbnVsbCApIHtcblx0XHRcdFx0dGhpcy5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG5cdFx0XHR9XG5cblx0XHRcdG9wdC5jdXJBbmltID0galF1ZXJ5LmV4dGVuZCh7fSwgcHJvcCk7XG5cblx0XHRcdGpRdWVyeS5lYWNoKCBwcm9wLCBmdW5jdGlvbiggbmFtZSwgdmFsICkge1xuXHRcdFx0XHR2YXIgZSA9IG5ldyBqUXVlcnkuZngoIHNlbGYsIG9wdCwgbmFtZSApO1xuXG5cdFx0XHRcdGlmICggcmZ4dHlwZXMudGVzdCh2YWwpICkge1xuXHRcdFx0XHRcdGVbIHZhbCA9PT0gXCJ0b2dnbGVcIiA/IGhpZGRlbiA/IFwic2hvd1wiIDogXCJoaWRlXCIgOiB2YWwgXSggcHJvcCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHBhcnRzID0gcmZ4bnVtLmV4ZWModmFsKSxcblx0XHRcdFx0XHRcdHN0YXJ0ID0gZS5jdXIodHJ1ZSkgfHwgMDtcblxuXHRcdFx0XHRcdGlmICggcGFydHMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgZW5kID0gcGFyc2VGbG9hdCggcGFydHNbMl0gKSxcblx0XHRcdFx0XHRcdFx0dW5pdCA9IHBhcnRzWzNdIHx8IFwicHhcIjtcblxuXHRcdFx0XHRcdFx0Ly8gV2UgbmVlZCB0byBjb21wdXRlIHN0YXJ0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YWx1ZVxuXHRcdFx0XHRcdFx0aWYgKCB1bml0ICE9PSBcInB4XCIgKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc3R5bGVbIG5hbWUgXSA9IChlbmQgfHwgMSkgKyB1bml0O1xuXHRcdFx0XHRcdFx0XHRzdGFydCA9ICgoZW5kIHx8IDEpIC8gZS5jdXIodHJ1ZSkpICogc3RhcnQ7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc3R5bGVbIG5hbWUgXSA9IHN0YXJ0ICsgdW5pdDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSWYgYSArPS8tPSB0b2tlbiB3YXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb3ZpZGVkLCB3ZSdyZSBkb2luZyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWxhdGl2ZSBhbmltYXRpb25cblx0XHRcdFx0XHRcdGlmICggcGFydHNbMV0gKSB7XG5cdFx0XHRcdFx0XHRcdGVuZCA9ICgocGFydHNbMV0gPT09IFwiLT1cIiA/IC0xIDogMSkgKiBlbmQpICsgc3RhcnQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGUuY3VzdG9tKCBzdGFydCwgZW5kLCB1bml0ICk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZS5jdXN0b20oIHN0YXJ0LCB2YWwsIFwiXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBGb3IgSlMgc3RyaWN0IGNvbXBsaWFuY2Vcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHN0b3A6IGZ1bmN0aW9uKCBjbGVhclF1ZXVlLCBnb3RvRW5kICkge1xuXHRcdHZhciB0aW1lcnMgPSBqUXVlcnkudGltZXJzO1xuXG5cdFx0aWYgKCBjbGVhclF1ZXVlICkge1xuXHRcdFx0dGhpcy5xdWV1ZShbXSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZ28gaW4gcmV2ZXJzZSBvcmRlciBzbyBhbnl0aGluZyBhZGRlZCB0byB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGR1cmluZyB0aGUgbG9vcCBpcyBpZ25vcmVkXG5cdFx0XHRmb3IgKCB2YXIgaSA9IHRpbWVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApIHtcblx0XHRcdFx0aWYgKCB0aW1lcnNbaV0uZWxlbSA9PT0gdGhpcyApIHtcblx0XHRcdFx0XHRpZiAoZ290b0VuZCkge1xuXHRcdFx0XHRcdFx0Ly8gZm9yY2UgdGhlIG5leHQgc3RlcCB0byBiZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3Rcblx0XHRcdFx0XHRcdHRpbWVyc1tpXSh0cnVlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aW1lcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBzdGFydCB0aGUgbmV4dCBpbiB0aGUgcXVldWUgaWYgdGhlIGxhc3Qgc3RlcCB3YXNuJ3QgZm9yY2VkXG5cdFx0aWYgKCAhZ290b0VuZCApIHtcblx0XHRcdHRoaXMuZGVxdWV1ZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pO1xuXG4vLyBHZW5lcmF0ZSBzaG9ydGN1dHMgZm9yIGN1c3RvbSBhbmltYXRpb25zXG5qUXVlcnkuZWFjaCh7XG5cdHNsaWRlRG93bjogZ2VuRngoXCJzaG93XCIsIDEpLFxuXHRzbGlkZVVwOiBnZW5GeChcImhpZGVcIiwgMSksXG5cdHNsaWRlVG9nZ2xlOiBnZW5GeChcInRvZ2dsZVwiLCAxKSxcblx0ZmFkZUluOiB7IG9wYWNpdHk6IFwic2hvd1wiIH0sXG5cdGZhZGVPdXQ6IHsgb3BhY2l0eTogXCJoaWRlXCIgfVxufSwgZnVuY3Rpb24oIG5hbWUsIHByb3BzICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzcGVlZCwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSggcHJvcHMsIHNwZWVkLCBjYWxsYmFjayApO1xuXHR9O1xufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHRzcGVlZDogZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGZuICkge1xuXHRcdHZhciBvcHQgPSBzcGVlZCAmJiB0eXBlb2Ygc3BlZWQgPT09IFwib2JqZWN0XCIgPyBzcGVlZCA6IHtcblx0XHRcdGNvbXBsZXRlOiBmbiB8fCAhZm4gJiYgZWFzaW5nIHx8XG5cdFx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxuXHRcdFx0ZHVyYXRpb246IHNwZWVkLFxuXHRcdFx0ZWFzaW5nOiBmbiAmJiBlYXNpbmcgfHwgZWFzaW5nICYmICFqUXVlcnkuaXNGdW5jdGlvbihlYXNpbmcpICYmIGVhc2luZ1xuXHRcdH07XG5cblx0XHRvcHQuZHVyYXRpb24gPSBqUXVlcnkuZngub2ZmID8gMCA6IHR5cGVvZiBvcHQuZHVyYXRpb24gPT09IFwibnVtYmVyXCIgPyBvcHQuZHVyYXRpb24gOlxuXHRcdFx0alF1ZXJ5LmZ4LnNwZWVkc1tvcHQuZHVyYXRpb25dIHx8IGpRdWVyeS5meC5zcGVlZHMuX2RlZmF1bHQ7XG5cblx0XHQvLyBRdWV1ZWluZ1xuXHRcdG9wdC5vbGQgPSBvcHQuY29tcGxldGU7XG5cdFx0b3B0LmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIG9wdC5xdWV1ZSAhPT0gZmFsc2UgKSB7XG5cdFx0XHRcdGpRdWVyeSh0aGlzKS5kZXF1ZXVlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBvcHQub2xkICkgKSB7XG5cdFx0XHRcdG9wdC5vbGQuY2FsbCggdGhpcyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gb3B0O1xuXHR9LFxuXG5cdGVhc2luZzoge1xuXHRcdGxpbmVhcjogZnVuY3Rpb24oIHAsIG4sIGZpcnN0TnVtLCBkaWZmICkge1xuXHRcdFx0cmV0dXJuIGZpcnN0TnVtICsgZGlmZiAqIHA7XG5cdFx0fSxcblx0XHRzd2luZzogZnVuY3Rpb24oIHAsIG4sIGZpcnN0TnVtLCBkaWZmICkge1xuXHRcdFx0cmV0dXJuICgoLU1hdGguY29zKHAqTWF0aC5QSSkvMikgKyAwLjUpICogZGlmZiArIGZpcnN0TnVtO1xuXHRcdH1cblx0fSxcblxuXHR0aW1lcnM6IFtdLFxuXG5cdGZ4OiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgcHJvcCApIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuZWxlbSA9IGVsZW07XG5cdFx0dGhpcy5wcm9wID0gcHJvcDtcblxuXHRcdGlmICggIW9wdGlvbnMub3JpZyApIHtcblx0XHRcdG9wdGlvbnMub3JpZyA9IHt9O1xuXHRcdH1cblx0fVxuXG59KTtcblxualF1ZXJ5LmZ4LnByb3RvdHlwZSA9IHtcblx0Ly8gU2ltcGxlIGZ1bmN0aW9uIGZvciBzZXR0aW5nIGEgc3R5bGUgdmFsdWVcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMub3B0aW9ucy5zdGVwICkge1xuXHRcdFx0dGhpcy5vcHRpb25zLnN0ZXAuY2FsbCggdGhpcy5lbGVtLCB0aGlzLm5vdywgdGhpcyApO1xuXHRcdH1cblxuXHRcdChqUXVlcnkuZnguc3RlcFt0aGlzLnByb3BdIHx8IGpRdWVyeS5meC5zdGVwLl9kZWZhdWx0KSggdGhpcyApO1xuXG5cdFx0Ly8gU2V0IGRpc3BsYXkgcHJvcGVydHkgdG8gYmxvY2sgZm9yIGhlaWdodC93aWR0aCBhbmltYXRpb25zXG5cdFx0aWYgKCAoIHRoaXMucHJvcCA9PT0gXCJoZWlnaHRcIiB8fCB0aGlzLnByb3AgPT09IFwid2lkdGhcIiApICYmIHRoaXMuZWxlbS5zdHlsZSApIHtcblx0XHRcdHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdH1cblx0fSxcblxuXHQvLyBHZXQgdGhlIGN1cnJlbnQgc2l6ZVxuXHRjdXI6IGZ1bmN0aW9uKCBmb3JjZSApIHtcblx0XHRpZiAoIHRoaXMuZWxlbVt0aGlzLnByb3BdICE9IG51bGwgJiYgKCF0aGlzLmVsZW0uc3R5bGUgfHwgdGhpcy5lbGVtLnN0eWxlW3RoaXMucHJvcF0gPT0gbnVsbCkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtWyB0aGlzLnByb3AgXTtcblx0XHR9XG5cblx0XHR2YXIgciA9IHBhcnNlRmxvYXQoalF1ZXJ5LmNzcyh0aGlzLmVsZW0sIHRoaXMucHJvcCwgZm9yY2UpKTtcblx0XHRyZXR1cm4gciAmJiByID4gLTEwMDAwID8gciA6IHBhcnNlRmxvYXQoalF1ZXJ5LmN1ckNTUyh0aGlzLmVsZW0sIHRoaXMucHJvcCkpIHx8IDA7XG5cdH0sXG5cblx0Ly8gU3RhcnQgYW4gYW5pbWF0aW9uIGZyb20gb25lIG51bWJlciB0byBhbm90aGVyXG5cdGN1c3RvbTogZnVuY3Rpb24oIGZyb20sIHRvLCB1bml0ICkge1xuXHRcdHRoaXMuc3RhcnRUaW1lID0gbm93KCk7XG5cdFx0dGhpcy5zdGFydCA9IGZyb207XG5cdFx0dGhpcy5lbmQgPSB0bztcblx0XHR0aGlzLnVuaXQgPSB1bml0IHx8IHRoaXMudW5pdCB8fCBcInB4XCI7XG5cdFx0dGhpcy5ub3cgPSB0aGlzLnN0YXJ0O1xuXHRcdHRoaXMucG9zID0gdGhpcy5zdGF0ZSA9IDA7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0ZnVuY3Rpb24gdCggZ290b0VuZCApIHtcblx0XHRcdHJldHVybiBzZWxmLnN0ZXAoZ290b0VuZCk7XG5cdFx0fVxuXG5cdFx0dC5lbGVtID0gdGhpcy5lbGVtO1xuXG5cdFx0aWYgKCB0KCkgJiYgalF1ZXJ5LnRpbWVycy5wdXNoKHQpICYmICF0aW1lcklkICkge1xuXHRcdFx0dGltZXJJZCA9IHNldEludGVydmFsKGpRdWVyeS5meC50aWNrLCAxMyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNpbXBsZSAnc2hvdycgZnVuY3Rpb25cblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gUmVtZW1iZXIgd2hlcmUgd2Ugc3RhcnRlZCwgc28gdGhhdCB3ZSBjYW4gZ28gYmFjayB0byBpdCBsYXRlclxuXHRcdHRoaXMub3B0aW9ucy5vcmlnW3RoaXMucHJvcF0gPSBqUXVlcnkuc3R5bGUoIHRoaXMuZWxlbSwgdGhpcy5wcm9wICk7XG5cdFx0dGhpcy5vcHRpb25zLnNob3cgPSB0cnVlO1xuXG5cdFx0Ly8gQmVnaW4gdGhlIGFuaW1hdGlvblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHdlIHN0YXJ0IGF0IGEgc21hbGwgd2lkdGgvaGVpZ2h0IHRvIGF2b2lkIGFueVxuXHRcdC8vIGZsYXNoIG9mIGNvbnRlbnRcblx0XHR0aGlzLmN1c3RvbSh0aGlzLnByb3AgPT09IFwid2lkdGhcIiB8fCB0aGlzLnByb3AgPT09IFwiaGVpZ2h0XCIgPyAxIDogMCwgdGhpcy5jdXIoKSk7XG5cblx0XHQvLyBTdGFydCBieSBzaG93aW5nIHRoZSBlbGVtZW50XG5cdFx0alF1ZXJ5KCB0aGlzLmVsZW0gKS5zaG93KCk7XG5cdH0sXG5cblx0Ly8gU2ltcGxlICdoaWRlJyBmdW5jdGlvblxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHQvLyBSZW1lbWJlciB3aGVyZSB3ZSBzdGFydGVkLCBzbyB0aGF0IHdlIGNhbiBnbyBiYWNrIHRvIGl0IGxhdGVyXG5cdFx0dGhpcy5vcHRpb25zLm9yaWdbdGhpcy5wcm9wXSA9IGpRdWVyeS5zdHlsZSggdGhpcy5lbGVtLCB0aGlzLnByb3AgKTtcblx0XHR0aGlzLm9wdGlvbnMuaGlkZSA9IHRydWU7XG5cblx0XHQvLyBCZWdpbiB0aGUgYW5pbWF0aW9uXG5cdFx0dGhpcy5jdXN0b20odGhpcy5jdXIoKSwgMCk7XG5cdH0sXG5cblx0Ly8gRWFjaCBzdGVwIG9mIGFuIGFuaW1hdGlvblxuXHRzdGVwOiBmdW5jdGlvbiggZ290b0VuZCApIHtcblx0XHR2YXIgdCA9IG5vdygpLCBkb25lID0gdHJ1ZTtcblxuXHRcdGlmICggZ290b0VuZCB8fCB0ID49IHRoaXMub3B0aW9ucy5kdXJhdGlvbiArIHRoaXMuc3RhcnRUaW1lICkge1xuXHRcdFx0dGhpcy5ub3cgPSB0aGlzLmVuZDtcblx0XHRcdHRoaXMucG9zID0gdGhpcy5zdGF0ZSA9IDE7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0XHR0aGlzLm9wdGlvbnMuY3VyQW5pbVsgdGhpcy5wcm9wIF0gPSB0cnVlO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSBpbiB0aGlzLm9wdGlvbnMuY3VyQW5pbSApIHtcblx0XHRcdFx0aWYgKCB0aGlzLm9wdGlvbnMuY3VyQW5pbVtpXSAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRkb25lID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBkb25lICkge1xuXHRcdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5kaXNwbGF5ICE9IG51bGwgKSB7XG5cdFx0XHRcdFx0Ly8gUmVzZXQgdGhlIG92ZXJmbG93XG5cdFx0XHRcdFx0dGhpcy5lbGVtLnN0eWxlLm92ZXJmbG93ID0gdGhpcy5vcHRpb25zLm92ZXJmbG93O1xuXG5cdFx0XHRcdFx0Ly8gUmVzZXQgdGhlIGRpc3BsYXlcblx0XHRcdFx0XHR2YXIgb2xkID0galF1ZXJ5LmRhdGEodGhpcy5lbGVtLCBcIm9sZGRpc3BsYXlcIik7XG5cdFx0XHRcdFx0dGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSBvbGQgPyBvbGQgOiB0aGlzLm9wdGlvbnMuZGlzcGxheTtcblxuXHRcdFx0XHRcdGlmICggalF1ZXJ5LmNzcyh0aGlzLmVsZW0sIFwiZGlzcGxheVwiKSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBIaWRlIHRoZSBlbGVtZW50IGlmIHRoZSBcImhpZGVcIiBvcGVyYXRpb24gd2FzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbmVcblx0XHRcdFx0aWYgKCB0aGlzLm9wdGlvbnMuaGlkZSApIHtcblx0XHRcdFx0XHRqUXVlcnkodGhpcy5lbGVtKS5oaWRlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZXNldCB0aGUgcHJvcGVydGllcywgaWYgdGhlIGl0ZW0gaGFzIGJlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZGVuIG9yIHNob3duXG5cdFx0XHRcdGlmICggdGhpcy5vcHRpb25zLmhpZGUgfHwgdGhpcy5vcHRpb25zLnNob3cgKSB7XG5cdFx0XHRcdFx0Zm9yICggdmFyIHAgaW4gdGhpcy5vcHRpb25zLmN1ckFuaW0gKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuc3R5bGUodGhpcy5lbGVtLCBwLCB0aGlzLm9wdGlvbnMub3JpZ1twXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRXhlY3V0ZSB0aGUgY29tcGxldGUgZnVuY3Rpb25cblx0XHRcdFx0dGhpcy5vcHRpb25zLmNvbXBsZXRlLmNhbGwoIHRoaXMuZWxlbSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG4gPSB0IC0gdGhpcy5zdGFydFRpbWU7XG5cdFx0XHR0aGlzLnN0YXRlID0gbiAvIHRoaXMub3B0aW9ucy5kdXJhdGlvbjtcblxuXHRcdFx0Ly8gUGVyZm9ybSB0aGUgZWFzaW5nIGZ1bmN0aW9uLCBkZWZhdWx0cyB0byBzd2luZ1xuXHRcdFx0dmFyIHNwZWNpYWxFYXNpbmcgPSB0aGlzLm9wdGlvbnMuc3BlY2lhbEVhc2luZyAmJiB0aGlzLm9wdGlvbnMuc3BlY2lhbEVhc2luZ1t0aGlzLnByb3BdO1xuXHRcdFx0dmFyIGRlZmF1bHRFYXNpbmcgPSB0aGlzLm9wdGlvbnMuZWFzaW5nIHx8IChqUXVlcnkuZWFzaW5nLnN3aW5nID8gXCJzd2luZ1wiIDogXCJsaW5lYXJcIik7XG5cdFx0XHR0aGlzLnBvcyA9IGpRdWVyeS5lYXNpbmdbc3BlY2lhbEVhc2luZyB8fCBkZWZhdWx0RWFzaW5nXSh0aGlzLnN0YXRlLCBuLCAwLCAxLCB0aGlzLm9wdGlvbnMuZHVyYXRpb24pO1xuXHRcdFx0dGhpcy5ub3cgPSB0aGlzLnN0YXJ0ICsgKCh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpICogdGhpcy5wb3MpO1xuXG5cdFx0XHQvLyBQZXJmb3JtIHRoZSBuZXh0IHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufTtcblxualF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmZ4LCB7XG5cdHRpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aW1lcnMgPSBqUXVlcnkudGltZXJzO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgdGltZXJzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0aWYgKCAhdGltZXJzW2ldKCkgKSB7XG5cdFx0XHRcdHRpbWVycy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICF0aW1lcnMubGVuZ3RoICkge1xuXHRcdFx0alF1ZXJ5LmZ4LnN0b3AoKTtcblx0XHR9XG5cdH0sXG5cdFx0XG5cdHN0b3A6IGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwoIHRpbWVySWQgKTtcblx0XHR0aW1lcklkID0gbnVsbDtcblx0fSxcblx0XG5cdHNwZWVkczoge1xuXHRcdHNsb3c6IDYwMCxcbiBcdFx0ZmFzdDogMjAwLFxuIFx0XHQvLyBEZWZhdWx0IHNwZWVkXG4gXHRcdF9kZWZhdWx0OiA0MDBcblx0fSxcblxuXHRzdGVwOiB7XG5cdFx0b3BhY2l0eTogZnVuY3Rpb24oIGZ4ICkge1xuXHRcdFx0alF1ZXJ5LnN0eWxlKGZ4LmVsZW0sIFwib3BhY2l0eVwiLCBmeC5ub3cpO1xuXHRcdH0sXG5cblx0XHRfZGVmYXVsdDogZnVuY3Rpb24oIGZ4ICkge1xuXHRcdFx0aWYgKCBmeC5lbGVtLnN0eWxlICYmIGZ4LmVsZW0uc3R5bGVbIGZ4LnByb3AgXSAhPSBudWxsICkge1xuXHRcdFx0XHRmeC5lbGVtLnN0eWxlWyBmeC5wcm9wIF0gPSAoZngucHJvcCA9PT0gXCJ3aWR0aFwiIHx8IGZ4LnByb3AgPT09IFwiaGVpZ2h0XCIgPyBNYXRoLm1heCgwLCBmeC5ub3cpIDogZngubm93KSArIGZ4LnVuaXQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmeC5lbGVtWyBmeC5wcm9wIF0gPSBmeC5ub3c7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuaWYgKCBqUXVlcnkuZXhwciAmJiBqUXVlcnkuZXhwci5maWx0ZXJzICkge1xuXHRqUXVlcnkuZXhwci5maWx0ZXJzLmFuaW1hdGVkID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ncmVwKGpRdWVyeS50aW1lcnMsIGZ1bmN0aW9uKCBmbiApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBmbi5lbGVtO1xuXHRcdH0pLmxlbmd0aDtcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2VuRngoIHR5cGUsIG51bSApIHtcblx0dmFyIG9iaiA9IHt9O1xuXG5cdGpRdWVyeS5lYWNoKCBmeEF0dHJzLmNvbmNhdC5hcHBseShbXSwgZnhBdHRycy5zbGljZSgwLG51bSkpLCBmdW5jdGlvbigpIHtcblx0XHRvYmpbIHRoaXMgXSA9IHR5cGU7XG5cdH0pO1xuXG5cdHJldHVybiBvYmo7XG59XG5pZiAoIFwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0XCIgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRqUXVlcnkuZm4ub2Zmc2V0ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xuXG5cdFx0aWYgKCBvcHRpb25zICkgeyBcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeS5vZmZzZXQuc2V0T2Zmc2V0KCB0aGlzLCBvcHRpb25zLCBpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoICFlbGVtIHx8ICFlbGVtLm93bmVyRG9jdW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIGVsZW0gPT09IGVsZW0ub3duZXJEb2N1bWVudC5ib2R5ICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5vZmZzZXQuYm9keU9mZnNldCggZWxlbSApO1xuXHRcdH1cblxuXHRcdHZhciBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBkb2MgPSBlbGVtLm93bmVyRG9jdW1lbnQsIGJvZHkgPSBkb2MuYm9keSwgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRjbGllbnRUb3AgPSBkb2NFbGVtLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwLCBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLFxuXHRcdFx0dG9wICA9IGJveC50b3AgICsgKHNlbGYucGFnZVlPZmZzZXQgfHwgalF1ZXJ5LnN1cHBvcnQuYm94TW9kZWwgJiYgZG9jRWxlbS5zY3JvbGxUb3AgIHx8IGJvZHkuc2Nyb2xsVG9wICkgLSBjbGllbnRUb3AsXG5cdFx0XHRsZWZ0ID0gYm94LmxlZnQgKyAoc2VsZi5wYWdlWE9mZnNldCB8fCBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbCAmJiBkb2NFbGVtLnNjcm9sbExlZnQgfHwgYm9keS5zY3JvbGxMZWZ0KSAtIGNsaWVudExlZnQ7XG5cblx0XHRyZXR1cm4geyB0b3A6IHRvcCwgbGVmdDogbGVmdCB9O1xuXHR9O1xuXG59IGVsc2Uge1xuXHRqUXVlcnkuZm4ub2Zmc2V0ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xuXG5cdFx0aWYgKCBvcHRpb25zICkgeyBcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeS5vZmZzZXQuc2V0T2Zmc2V0KCB0aGlzLCBvcHRpb25zLCBpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoICFlbGVtIHx8ICFlbGVtLm93bmVyRG9jdW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAoIGVsZW0gPT09IGVsZW0ub3duZXJEb2N1bWVudC5ib2R5ICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5vZmZzZXQuYm9keU9mZnNldCggZWxlbSApO1xuXHRcdH1cblxuXHRcdGpRdWVyeS5vZmZzZXQuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0dmFyIG9mZnNldFBhcmVudCA9IGVsZW0ub2Zmc2V0UGFyZW50LCBwcmV2T2Zmc2V0UGFyZW50ID0gZWxlbSxcblx0XHRcdGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudCwgY29tcHV0ZWRTdHlsZSwgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRib2R5ID0gZG9jLmJvZHksIGRlZmF1bHRWaWV3ID0gZG9jLmRlZmF1bHRWaWV3LFxuXHRcdFx0cHJldkNvbXB1dGVkU3R5bGUgPSBkZWZhdWx0VmlldyA/IGRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoIGVsZW0sIG51bGwgKSA6IGVsZW0uY3VycmVudFN0eWxlLFxuXHRcdFx0dG9wID0gZWxlbS5vZmZzZXRUb3AsIGxlZnQgPSBlbGVtLm9mZnNldExlZnQ7XG5cblx0XHR3aGlsZSAoIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKSAmJiBlbGVtICE9PSBib2R5ICYmIGVsZW0gIT09IGRvY0VsZW0gKSB7XG5cdFx0XHRpZiAoIGpRdWVyeS5vZmZzZXQuc3VwcG9ydHNGaXhlZFBvc2l0aW9uICYmIHByZXZDb21wdXRlZFN0eWxlLnBvc2l0aW9uID09PSBcImZpeGVkXCIgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb21wdXRlZFN0eWxlID0gZGVmYXVsdFZpZXcgPyBkZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsZW0sIG51bGwpIDogZWxlbS5jdXJyZW50U3R5bGU7XG5cdFx0XHR0b3AgIC09IGVsZW0uc2Nyb2xsVG9wO1xuXHRcdFx0bGVmdCAtPSBlbGVtLnNjcm9sbExlZnQ7XG5cblx0XHRcdGlmICggZWxlbSA9PT0gb2Zmc2V0UGFyZW50ICkge1xuXHRcdFx0XHR0b3AgICs9IGVsZW0ub2Zmc2V0VG9wO1xuXHRcdFx0XHRsZWZ0ICs9IGVsZW0ub2Zmc2V0TGVmdDtcblxuXHRcdFx0XHRpZiAoIGpRdWVyeS5vZmZzZXQuZG9lc05vdEFkZEJvcmRlciAmJiAhKGpRdWVyeS5vZmZzZXQuZG9lc0FkZEJvcmRlckZvclRhYmxlQW5kQ2VsbHMgJiYgL150KGFibGV8ZHxoKSQvaS50ZXN0KGVsZW0ubm9kZU5hbWUpKSApIHtcblx0XHRcdFx0XHR0b3AgICs9IHBhcnNlRmxvYXQoIGNvbXB1dGVkU3R5bGUuYm9yZGVyVG9wV2lkdGggICkgfHwgMDtcblx0XHRcdFx0XHRsZWZ0ICs9IHBhcnNlRmxvYXQoIGNvbXB1dGVkU3R5bGUuYm9yZGVyTGVmdFdpZHRoICkgfHwgMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByZXZPZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQsIG9mZnNldFBhcmVudCA9IGVsZW0ub2Zmc2V0UGFyZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGpRdWVyeS5vZmZzZXQuc3VidHJhY3RzQm9yZGVyRm9yT3ZlcmZsb3dOb3RWaXNpYmxlICYmIGNvbXB1dGVkU3R5bGUub3ZlcmZsb3cgIT09IFwidmlzaWJsZVwiICkge1xuXHRcdFx0XHR0b3AgICs9IHBhcnNlRmxvYXQoIGNvbXB1dGVkU3R5bGUuYm9yZGVyVG9wV2lkdGggICkgfHwgMDtcblx0XHRcdFx0bGVmdCArPSBwYXJzZUZsb2F0KCBjb21wdXRlZFN0eWxlLmJvcmRlckxlZnRXaWR0aCApIHx8IDA7XG5cdFx0XHR9XG5cblx0XHRcdHByZXZDb21wdXRlZFN0eWxlID0gY29tcHV0ZWRTdHlsZTtcblx0XHR9XG5cblx0XHRpZiAoIHByZXZDb21wdXRlZFN0eWxlLnBvc2l0aW9uID09PSBcInJlbGF0aXZlXCIgfHwgcHJldkNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHR0b3AgICs9IGJvZHkub2Zmc2V0VG9wO1xuXHRcdFx0bGVmdCArPSBib2R5Lm9mZnNldExlZnQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkub2Zmc2V0LnN1cHBvcnRzRml4ZWRQb3NpdGlvbiAmJiBwcmV2Q29tcHV0ZWRTdHlsZS5wb3NpdGlvbiA9PT0gXCJmaXhlZFwiICkge1xuXHRcdFx0dG9wICArPSBNYXRoLm1heCggZG9jRWxlbS5zY3JvbGxUb3AsIGJvZHkuc2Nyb2xsVG9wICk7XG5cdFx0XHRsZWZ0ICs9IE1hdGgubWF4KCBkb2NFbGVtLnNjcm9sbExlZnQsIGJvZHkuc2Nyb2xsTGVmdCApO1xuXHRcdH1cblxuXHRcdHJldHVybiB7IHRvcDogdG9wLCBsZWZ0OiBsZWZ0IH07XG5cdH07XG59XG5cbmpRdWVyeS5vZmZzZXQgPSB7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSwgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgaW5uZXJEaXYsIGNoZWNrRGl2LCB0YWJsZSwgdGQsIGJvZHlNYXJnaW5Ub3AgPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3VyQ1NTKGJvZHksIFwibWFyZ2luVG9wXCIsIHRydWUpICkgfHwgMCxcblx0XHRcdGh0bWwgPSBcIjxkaXYgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDttYXJnaW46MDtib3JkZXI6NXB4IHNvbGlkICMwMDA7cGFkZGluZzowO3dpZHRoOjFweDtoZWlnaHQ6MXB4Oyc+PGRpdj48L2Rpdj48L2Rpdj48dGFibGUgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDttYXJnaW46MDtib3JkZXI6NXB4IHNvbGlkICMwMDA7cGFkZGluZzowO3dpZHRoOjFweDtoZWlnaHQ6MXB4OycgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJz48dHI+PHRkPjwvdGQ+PC90cj48L3RhYmxlPlwiO1xuXG5cdFx0alF1ZXJ5LmV4dGVuZCggY29udGFpbmVyLnN0eWxlLCB7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogMCwgbGVmdDogMCwgbWFyZ2luOiAwLCBib3JkZXI6IDAsIHdpZHRoOiBcIjFweFwiLCBoZWlnaHQ6IFwiMXB4XCIsIHZpc2liaWxpdHk6IFwiaGlkZGVuXCIgfSApO1xuXG5cdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0Ym9keS5pbnNlcnRCZWZvcmUoIGNvbnRhaW5lciwgYm9keS5maXJzdENoaWxkICk7XG5cdFx0aW5uZXJEaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZDtcblx0XHRjaGVja0RpdiA9IGlubmVyRGl2LmZpcnN0Q2hpbGQ7XG5cdFx0dGQgPSBpbm5lckRpdi5uZXh0U2libGluZy5maXJzdENoaWxkLmZpcnN0Q2hpbGQ7XG5cblx0XHR0aGlzLmRvZXNOb3RBZGRCb3JkZXIgPSAoY2hlY2tEaXYub2Zmc2V0VG9wICE9PSA1KTtcblx0XHR0aGlzLmRvZXNBZGRCb3JkZXJGb3JUYWJsZUFuZENlbGxzID0gKHRkLm9mZnNldFRvcCA9PT0gNSk7XG5cblx0XHRjaGVja0Rpdi5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIiwgY2hlY2tEaXYuc3R5bGUudG9wID0gXCIyMHB4XCI7XG5cdFx0Ly8gc2FmYXJpIHN1YnRyYWN0cyBwYXJlbnQgYm9yZGVyIHdpZHRoIGhlcmUgd2hpY2ggaXMgNXB4XG5cdFx0dGhpcy5zdXBwb3J0c0ZpeGVkUG9zaXRpb24gPSAoY2hlY2tEaXYub2Zmc2V0VG9wID09PSAyMCB8fCBjaGVja0Rpdi5vZmZzZXRUb3AgPT09IDE1KTtcblx0XHRjaGVja0Rpdi5zdHlsZS5wb3NpdGlvbiA9IGNoZWNrRGl2LnN0eWxlLnRvcCA9IFwiXCI7XG5cblx0XHRpbm5lckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCIsIGlubmVyRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRcdHRoaXMuc3VidHJhY3RzQm9yZGVyRm9yT3ZlcmZsb3dOb3RWaXNpYmxlID0gKGNoZWNrRGl2Lm9mZnNldFRvcCA9PT0gLTUpO1xuXG5cdFx0dGhpcy5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCA9IChib2R5Lm9mZnNldFRvcCAhPT0gYm9keU1hcmdpblRvcCk7XG5cblx0XHRib2R5LnJlbW92ZUNoaWxkKCBjb250YWluZXIgKTtcblx0XHRib2R5ID0gY29udGFpbmVyID0gaW5uZXJEaXYgPSBjaGVja0RpdiA9IHRhYmxlID0gdGQgPSBudWxsO1xuXHRcdGpRdWVyeS5vZmZzZXQuaW5pdGlhbGl6ZSA9IGpRdWVyeS5ub29wO1xuXHR9LFxuXG5cdGJvZHlPZmZzZXQ6IGZ1bmN0aW9uKCBib2R5ICkge1xuXHRcdHZhciB0b3AgPSBib2R5Lm9mZnNldFRvcCwgbGVmdCA9IGJvZHkub2Zmc2V0TGVmdDtcblxuXHRcdGpRdWVyeS5vZmZzZXQuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0aWYgKCBqUXVlcnkub2Zmc2V0LmRvZXNOb3RJbmNsdWRlTWFyZ2luSW5Cb2R5T2Zmc2V0ICkge1xuXHRcdFx0dG9wICArPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3VyQ1NTKGJvZHksIFwibWFyZ2luVG9wXCIsICB0cnVlKSApIHx8IDA7XG5cdFx0XHRsZWZ0ICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jdXJDU1MoYm9keSwgXCJtYXJnaW5MZWZ0XCIsIHRydWUpICkgfHwgMDtcblx0XHR9XG5cblx0XHRyZXR1cm4geyB0b3A6IHRvcCwgbGVmdDogbGVmdCB9O1xuXHR9LFxuXHRcblx0c2V0T2Zmc2V0OiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgaSApIHtcblx0XHQvLyBzZXQgcG9zaXRpb24gZmlyc3QsIGluLWNhc2UgdG9wL2xlZnQgYXJlIHNldCBldmVuIG9uIHN0YXRpY1xuICAgICAgICAgICAgICAgIC8vIGVsZW1cblx0XHRpZiAoIC9zdGF0aWMvLnRlc3QoIGpRdWVyeS5jdXJDU1MoIGVsZW0sIFwicG9zaXRpb25cIiApICkgKSB7XG5cdFx0XHRlbGVtLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRcdH1cblx0XHR2YXIgY3VyRWxlbSAgID0galF1ZXJ5KCBlbGVtICksXG5cdFx0XHRjdXJPZmZzZXQgPSBjdXJFbGVtLm9mZnNldCgpLFxuXHRcdFx0Y3VyVG9wICAgID0gcGFyc2VJbnQoIGpRdWVyeS5jdXJDU1MoIGVsZW0sIFwidG9wXCIsICB0cnVlICksIDEwICkgfHwgMCxcblx0XHRcdGN1ckxlZnQgICA9IHBhcnNlSW50KCBqUXVlcnkuY3VyQ1NTKCBlbGVtLCBcImxlZnRcIiwgdHJ1ZSApLCAxMCApIHx8IDA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBvcHRpb25zICkgKSB7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucy5jYWxsKCBlbGVtLCBpLCBjdXJPZmZzZXQgKTtcblx0XHR9XG5cblx0XHR2YXIgcHJvcHMgPSB7XG5cdFx0XHR0b3A6ICAob3B0aW9ucy50b3AgIC0gY3VyT2Zmc2V0LnRvcCkgICsgY3VyVG9wLFxuXHRcdFx0bGVmdDogKG9wdGlvbnMubGVmdCAtIGN1ck9mZnNldC5sZWZ0KSArIGN1ckxlZnRcblx0XHR9O1xuXHRcdFxuXHRcdGlmICggXCJ1c2luZ1wiIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRvcHRpb25zLnVzaW5nLmNhbGwoIGVsZW0sIHByb3BzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1ckVsZW0uY3NzKCBwcm9wcyApO1xuXHRcdH1cblx0fVxufTtcblxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0cG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggIXRoaXNbMF0gKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHR2YXIgZWxlbSA9IHRoaXNbMF0sXG5cblx0XHQvLyBHZXQgKnJlYWwqIG9mZnNldFBhcmVudFxuXHRcdG9mZnNldFBhcmVudCA9IHRoaXMub2Zmc2V0UGFyZW50KCksXG5cblx0XHQvLyBHZXQgY29ycmVjdCBvZmZzZXRzXG5cdFx0b2Zmc2V0ICAgICAgID0gdGhpcy5vZmZzZXQoKSxcblx0XHRwYXJlbnRPZmZzZXQgPSAvXmJvZHl8aHRtbCQvaS50ZXN0KG9mZnNldFBhcmVudFswXS5ub2RlTmFtZSkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogb2Zmc2V0UGFyZW50Lm9mZnNldCgpO1xuXG5cdFx0Ly8gU3VidHJhY3QgZWxlbWVudCBtYXJnaW5zXG5cdFx0Ly8gbm90ZTogd2hlbiBhbiBlbGVtZW50IGhhcyBtYXJnaW46IGF1dG8gdGhlIG9mZnNldExlZnQgYW5kXG4gICAgICAgICAgICAgICAgLy8gbWFyZ2luTGVmdFxuXHRcdC8vIGFyZSB0aGUgc2FtZSBpbiBTYWZhcmkgY2F1c2luZyBvZmZzZXQubGVmdCB0byBpbmNvcnJlY3RseSBiZVxuICAgICAgICAgICAgICAgIC8vIDBcblx0XHRvZmZzZXQudG9wICAtPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3VyQ1NTKGVsZW0sIFwibWFyZ2luVG9wXCIsICB0cnVlKSApIHx8IDA7XG5cdFx0b2Zmc2V0LmxlZnQgLT0gcGFyc2VGbG9hdCggalF1ZXJ5LmN1ckNTUyhlbGVtLCBcIm1hcmdpbkxlZnRcIiwgdHJ1ZSkgKSB8fCAwO1xuXG5cdFx0Ly8gQWRkIG9mZnNldFBhcmVudCBib3JkZXJzXG5cdFx0cGFyZW50T2Zmc2V0LnRvcCAgKz0gcGFyc2VGbG9hdCggalF1ZXJ5LmN1ckNTUyhvZmZzZXRQYXJlbnRbMF0sIFwiYm9yZGVyVG9wV2lkdGhcIiwgIHRydWUpICkgfHwgMDtcblx0XHRwYXJlbnRPZmZzZXQubGVmdCArPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3VyQ1NTKG9mZnNldFBhcmVudFswXSwgXCJib3JkZXJMZWZ0V2lkdGhcIiwgdHJ1ZSkgKSB8fCAwO1xuXG5cdFx0Ly8gU3VidHJhY3QgdGhlIHR3byBvZmZzZXRzXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcDogIG9mZnNldC50b3AgIC0gcGFyZW50T2Zmc2V0LnRvcCxcblx0XHRcdGxlZnQ6IG9mZnNldC5sZWZ0IC0gcGFyZW50T2Zmc2V0LmxlZnRcblx0XHR9O1xuXHR9LFxuXG5cdG9mZnNldFBhcmVudDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9mZnNldFBhcmVudCA9IHRoaXMub2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cdFx0XHR3aGlsZSAoIG9mZnNldFBhcmVudCAmJiAoIS9eYm9keXxodG1sJC9pLnRlc3Qob2Zmc2V0UGFyZW50Lm5vZGVOYW1lKSAmJiBqUXVlcnkuY3NzKG9mZnNldFBhcmVudCwgXCJwb3NpdGlvblwiKSA9PT0gXCJzdGF0aWNcIikgKSB7XG5cdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2Zmc2V0UGFyZW50O1xuXHRcdH0pO1xuXHR9XG59KTtcblxuXG4vLyBDcmVhdGUgc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wIG1ldGhvZHNcbmpRdWVyeS5lYWNoKCBbXCJMZWZ0XCIsIFwiVG9wXCJdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0dmFyIG1ldGhvZCA9IFwic2Nyb2xsXCIgKyBuYW1lO1xuXG5cdGpRdWVyeS5mblsgbWV0aG9kIF0gPSBmdW5jdGlvbih2YWwpIHtcblx0XHR2YXIgZWxlbSA9IHRoaXNbMF0sIHdpbjtcblx0XHRcblx0XHRpZiAoICFlbGVtICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKCB2YWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdC8vIFNldCB0aGUgc2Nyb2xsIG9mZnNldFxuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0d2luID0gZ2V0V2luZG93KCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCB3aW4gKSB7XG5cdFx0XHRcdFx0d2luLnNjcm9sbFRvKFxuXHRcdFx0XHRcdFx0IWkgPyB2YWwgOiBqUXVlcnkod2luKS5zY3JvbGxMZWZ0KCksXG5cdFx0XHRcdFx0XHQgaSA/IHZhbCA6IGpRdWVyeSh3aW4pLnNjcm9sbFRvcCgpXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXNbIG1ldGhvZCBdID0gdmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luID0gZ2V0V2luZG93KCBlbGVtICk7XG5cblx0XHRcdC8vIFJldHVybiB0aGUgc2Nyb2xsIG9mZnNldFxuXHRcdFx0cmV0dXJuIHdpbiA/IChcInBhZ2VYT2Zmc2V0XCIgaW4gd2luKSA/IHdpblsgaSA/IFwicGFnZVlPZmZzZXRcIiA6IFwicGFnZVhPZmZzZXRcIiBdIDpcblx0XHRcdFx0alF1ZXJ5LnN1cHBvcnQuYm94TW9kZWwgJiYgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgbWV0aG9kIF0gfHxcblx0XHRcdFx0XHR3aW4uZG9jdW1lbnQuYm9keVsgbWV0aG9kIF0gOlxuXHRcdFx0XHRlbGVtWyBtZXRob2QgXTtcblx0XHR9XG5cdH07XG59KTtcblxuZnVuY3Rpb24gZ2V0V2luZG93KCBlbGVtICkge1xuXHRyZXR1cm4gKFwic2Nyb2xsVG9cIiBpbiBlbGVtICYmIGVsZW0uZG9jdW1lbnQpID9cblx0XHRlbGVtIDpcblx0XHRlbGVtLm5vZGVUeXBlID09PSA5ID9cblx0XHRcdGVsZW0uZGVmYXVsdFZpZXcgfHwgZWxlbS5wYXJlbnRXaW5kb3cgOlxuXHRcdFx0ZmFsc2U7XG59XG4vLyBDcmVhdGUgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGgsIG91dGVySGVpZ2h0IGFuZCBvdXRlcldpZHRoIG1ldGhvZHNcbmpRdWVyeS5lYWNoKFsgXCJIZWlnaHRcIiwgXCJXaWR0aFwiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXG5cdHZhciB0eXBlID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdC8vIGlubmVySGVpZ2h0IGFuZCBpbm5lcldpZHRoXG5cdGpRdWVyeS5mbltcImlubmVyXCIgKyBuYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzWzBdID9cblx0XHRcdGpRdWVyeS5jc3MoIHRoaXNbMF0sIHR5cGUsIGZhbHNlLCBcInBhZGRpbmdcIiApIDpcblx0XHRcdG51bGw7XG5cdH07XG5cblx0Ly8gb3V0ZXJIZWlnaHQgYW5kIG91dGVyV2lkdGhcblx0alF1ZXJ5LmZuW1wib3V0ZXJcIiArIG5hbWVdID0gZnVuY3Rpb24oIG1hcmdpbiApIHtcblx0XHRyZXR1cm4gdGhpc1swXSA/XG5cdFx0XHRqUXVlcnkuY3NzKCB0aGlzWzBdLCB0eXBlLCBmYWxzZSwgbWFyZ2luID8gXCJtYXJnaW5cIiA6IFwiYm9yZGVyXCIgKSA6XG5cdFx0XHRudWxsO1xuXHR9O1xuXG5cdGpRdWVyeS5mblsgdHlwZSBdID0gZnVuY3Rpb24oIHNpemUgKSB7XG5cdFx0Ly8gR2V0IHdpbmRvdyB3aWR0aCBvciBoZWlnaHRcblx0XHR2YXIgZWxlbSA9IHRoaXNbMF07XG5cdFx0aWYgKCAhZWxlbSApIHtcblx0XHRcdHJldHVybiBzaXplID09IG51bGwgPyBudWxsIDogdGhpcztcblx0XHR9XG5cdFx0XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2l6ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0dmFyIHNlbGYgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdFx0c2VsZlsgdHlwZSBdKCBzaXplLmNhbGwoIHRoaXMsIGksIHNlbGZbIHR5cGUgXSgpICkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXCJzY3JvbGxUb1wiIGluIGVsZW0gJiYgZWxlbS5kb2N1bWVudCkgPyAvLyBkb2VzIGl0IHdhbGtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgcXVhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsaWtlIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aW5kb3c/XG5cdFx0XHQvLyBFdmVyeW9uZSBlbHNlIHVzZSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkgZGVwZW5kaW5nIG9uIFF1aXJrcyB2cyBTdGFuZGFyZHMgbW9kZVxuXHRcdFx0ZWxlbS5kb2N1bWVudC5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiAmJiBlbGVtLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgXCJjbGllbnRcIiArIG5hbWUgXSB8fFxuXHRcdFx0ZWxlbS5kb2N1bWVudC5ib2R5WyBcImNsaWVudFwiICsgbmFtZSBdIDpcblxuXHRcdFx0Ly8gR2V0IGRvY3VtZW50IHdpZHRoIG9yIGhlaWdodFxuXHRcdFx0KGVsZW0ubm9kZVR5cGUgPT09IDkpID8gLy8gaXMgaXQgYSBkb2N1bWVudFxuXHRcdFx0XHQvLyBFaXRoZXIgc2Nyb2xsW1dpZHRoL0hlaWdodF0gb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0W1dpZHRoL0hlaWdodF0sIHdoaWNoZXZlciBpcyBncmVhdGVyXG5cdFx0XHRcdE1hdGgubWF4KFxuXHRcdFx0XHRcdGVsZW0uZG9jdW1lbnRFbGVtZW50W1wiY2xpZW50XCIgKyBuYW1lXSxcblx0XHRcdFx0XHRlbGVtLmJvZHlbXCJzY3JvbGxcIiArIG5hbWVdLCBlbGVtLmRvY3VtZW50RWxlbWVudFtcInNjcm9sbFwiICsgbmFtZV0sXG5cdFx0XHRcdFx0ZWxlbS5ib2R5W1wib2Zmc2V0XCIgKyBuYW1lXSwgZWxlbS5kb2N1bWVudEVsZW1lbnRbXCJvZmZzZXRcIiArIG5hbWVdXG5cdFx0XHRcdCkgOlxuXG5cdFx0XHRcdC8vIEdldCBvciBzZXQgd2lkdGggb3IgaGVpZ2h0IG9uIHRoZSBlbGVtZW50XG5cdFx0XHRcdHNpemUgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdFx0Ly8gR2V0IHdpZHRoIG9yIGhlaWdodCBvbiB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdGpRdWVyeS5jc3MoIGVsZW0sIHR5cGUgKSA6XG5cblx0XHRcdFx0XHQvLyBTZXQgdGhlIHdpZHRoIG9yIGhlaWdodCBvbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50IChkZWZhdWx0IHRvIHBpeGVscyBpZiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzIHVuaXRsZXNzKVxuXHRcdFx0XHRcdHRoaXMuY3NzKCB0eXBlLCB0eXBlb2Ygc2l6ZSA9PT0gXCJzdHJpbmdcIiA/IHNpemUgOiBzaXplICsgXCJweFwiICk7XG5cdH07XG5cbn0pO1xuXG4vLyBFeHBvc2UgalF1ZXJ5IHRvIHRoZSBnbG9iYWwgb2JqZWN0XG53aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSBqUXVlcnk7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJylcbiAgbW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7XG5cbn0pKHRoaXMpO1xuXG59KSgpIl19
;
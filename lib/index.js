/**
*
*	STREAM: chunkify
*
*
*	DESCRIPTION:
*		- Transform stream factory to chunk streamed data values.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/08/09: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] through2
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Through module:
		through2 = require( 'through2' );


	// FUNCTIONS //

	/**
	* FUNCTION: onData( numValues )
	*	Returns a callback which chunks streamed data values.
	*
	* @private
	* @param {Number} numValues - number of values to chunk
	* @returns {Function} callback
	*/
	function onData( numValues ) {
		var i = -1, buffer;

		// Initialize the buffer array used for chunking:
		buffer = new Array( numValues );

		/**
		* FUNCTION: onData( newVal, encoding, clbk )
		*	Data event handler. Chunks data.
		*
		* @private
		* @param {Number} newVal - new streamed data value
		* @param {String} encoding
		* @param {Function} clbk - callback to invoke after handling streamed data. Function accepts two arguments: [ error, chunk ].
		*/
		return function onData( newVal, encoding, clbk ) {
			i += 1;
			buffer[ i ] = newVal;
			if ( i === numValues-1 ) {
				i = -1;
				clbk( null, buffer.slice() );
				return;
			}
			clbk();
		}; // end FUNCTION onData()
	} // end FUNCTION onData()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @constructor
	* @returns {Stream} Stream instance
	*/
	function Stream() {
		this._numValues = 1;
		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: numValues( value )
	*	Setter and getter for number of values to chunk. If a value is provided, sets the number of values. If no value is provided, returns the number of values.
	*
	* @param {Number} value - number of values to chunk
	* @returns {Stream|Number} Stream instance or number of values to chunk
	*/
	Stream.prototype.numValues = function( value ) {
		if ( !arguments.length ) {
			return this._numValues;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'numValues()::invalid input argument. Number of values must be numeric.' );
		}
		if ( value <= 0 ) {
			throw new Error( 'numValues()::invalid input argument. Number of values should be a positive integer.' );
		}
		this._numValues = parseInt( value, 10 );
		return this;
	}; // end METHOD numValues()

	/**
	* METHOD: stream()
	*	Returns a through stream for chunking streamed data values.
	*
	* @returns {object} through stream
	*/
	Stream.prototype.stream = function() {
		return through2( {'objectMode': true}, onData( this._numValues ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();
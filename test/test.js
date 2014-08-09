
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	chunkStream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-chunkify', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( chunkStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to set/get the number of values to chunk', function test() {
		var cStream = chunkStream();
		expect( cStream.numValues ).to.be.a( 'function' );
	});

	it( 'should set the number of values to chunk', function test() {
		var cStream = chunkStream();
		cStream.numValues( 25 );
		assert.strictEqual( cStream.numValues(), 25 );
	});

	it( 'should not allow a non-numeric number of values to chunk', function test() {
		var cStream = chunkStream(),
			values = [
				'5',
				[],
				{},
				null,
				undefined,
				NaN,
				false,
				function(){}
			];
		
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				cStream.numValues( value );
			};
		}
	});

	it( 'should not allow a negative number of values to chunk', function test() {
		var cStream = chunkStream();

		expect( badValue( -5 ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				cStream.numValues( value );
			};
		}
	});

	it( 'should not allow the number of values to chunk to equal 0', function test() {
		var cStream = chunkStream();

		expect( badValue( 0 ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				cStream.numValues( value );
			};
		}
	});

	it( 'should convert a non-integer number of values to chunk to an integer', function test() {
		var cStream = chunkStream();

		cStream.numValues( 5.2334 );

		assert.strictEqual( cStream.numValues(), 5 );
	});

	it( 'should have a default behavior of chunking individual values', function test( done ) {
		var data, expected, cStream;

		// Simulate some data...
		data = [ 1,2,3,4,5 ];

		// Expected values:
		expected = [ [1],[2],[3],[4],[5] ];

		// Create a new chunkify stream:
		cStream = chunkStream().stream();

		// Mock reading from the stream:
		utils.readStream( cStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, cStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			for ( var i = 0; i < expected.length; i++ ) {
				assert.deepEqual(
					actual[ i ],
					expected[ i ]
				);
			}

			done();
		} // end FUNCTION onRead()
	});

	it( 'should chunk streamed data values', function test( done ) {
		var data, expected, cStream, NUMVALUES = 3;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5 ];

		// Expected values:
		expected = [ [2,2,2], [3,3,3], [4,4,4], [5,5,5] ];

		// Create a new chunkify stream:
		cStream = chunkStream()
			.numValues( NUMVALUES )
			.stream();

		// Mock reading from the stream:
		utils.readStream( cStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, cStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			for ( var i = 0; i < expected.length; i++ ) {
				assert.deepEqual(
					actual[ i ],
					expected[ i ]
				);
			}

			done();
		} // end FUNCTION onRead()
	});

});
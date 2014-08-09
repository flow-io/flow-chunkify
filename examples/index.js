var eventStream = require( 'event-stream' ),
	cStream = require( '../lib' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = eventStream.readArray( data );

// Create a new chunkify stream:
var stream = cStream()
	.numValues( 10 )
	.stream();

// Pipe the data:
readStream.pipe( stream )
	.pipe( eventStream.map( function( d, clbk ){
		clbk( null, JSON.stringify( d )+'\n' );
	}))
	.pipe( process.stdout );
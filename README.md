flow-chunkify
=============

Transform stream factory to chunk streamed data values.


## Installation

``` bash
$ npm install flow-chunkify
```

## API

To create a stream factory,

``` javascript
var chunkStream = require( 'flow-chunkify' );

// Create a new factory:
var cStream = chunkStream();
```

### cStream.numValues( [numValues] )

This method is a setter/getter. If no `numValues` is provided, returns the `numValues` to chunk; default is `1`. To set the `numValues`,

``` javascript
cStream.numValues( 10 );
```

### cStream.stream()

To create a new chunkify stream,

``` javascript
var stream = cStream.stream();
```


## Usage

Methods are chainable.

``` javascript
chunkStream()
	.numValues( 10 )
	.stream()
	.pipe( /* writable stream */ );
```



## Examples

``` javascript
var eventStream = require( 'event-stream' ),
	cStream = require( 'flow-chunkify' );

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
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have globally installed Mocha, execute the following command in the top-level application directory to run the tests:

``` bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality.


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


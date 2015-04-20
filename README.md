# Purity

Purity is a simple, intuitive JSON data cleansing utility for node.js

```javascript
var Purity = require('purity').Purity;
var person = new Purity({ name: { $type: String, $required: true }, age: { $type: Number, $default: 'Unknown' } });

var data = { name: 'John Doe' };

person.cleanse(data, function (err, res) {
	console.log(res);
	// { name: 'John Doe', age: 'Unknown' };
});

```

Create complex schemas from basic building blocks

```javascript

var person = new Purity({ name: { $type: String, $required: true }, email: { $type:  } });

```


#### General Options

###### `{ $type: Any }`

* `$required: Boolean` - *Validation will fail if the field is null or undefined*
* `$default: Any|Function` - *Replaces this field if it is null or undefined*
* `$cast: Boolean` - *Cast to the required type*


#### Array Options

###### `[ { $type: Any } ]`

* `$purge: Boolean` - *Remove invalid element from the array instead of failing validation*
* `$unique: Boolean` - *Remove duplicates from the array; (primitives only)*
* `$sort: 'asc|desc'|Function` - *Sort elements ascending/descending or by a custom function*


#### String Options

###### `{ $type: String }`

* `$maxlength: Number > 0` - *Maximum character length*
* `$minlength: Number > 0` - *Minimum character length*
* `$fixedwidth: Number > 0` - *Fixed character width*
* `$regex: Regexp` - *Test the field against a regular expression*
* `$toupper` - *Convert string to upper case*
* `$tolower` - *convert string to lower case*


#### Number Options

###### `{ $type: Number }`

* `$gt: Number` - *Field must be greater than a value*
* `$gte: Number` - *Field must be greater than or equal to a value*
* `$lt: Number` - *Field must be less than a value*
* `$lte: Number` - *Field must be less than or equal to a value*
* `$integer: Boolean` - *round to nearest integer*
* `$tofixed: Number > 0, < 20` - *round to a fixed number of decimal points*
* `$abs: Boolean` - *convert to absolute value*
* `$neg: Boolean` - *convert to negative value*
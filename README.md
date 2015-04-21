# Purity

## TLDR documentation:

Purity is a simple, intuitive JSON data cleansing utility for node.js

```javascript

var Schema = require('purity').Schema;
var person = new Schema({ 
	name: { $type: String, $required: true }, 
	age: { $type: Number, $default: 'Unknown' } 
});

var data = { name: 'John Doe' };

person.cleanse(data, function (err, res) {
	console.log(res);
	// { name: 'John Doe', age: 'Unknown' };
});

```

Validate complex data structures with simple, easy-to-read, highly configurable schemas.

```javascript

var ObjectID = require('mongodb').ObjectID;

var options = { strict: true };

var player = new Schema({
	name: { $type: String, $required: true },
	lastOnline: { $type: Number, $default: Date.now },
	emails: [{ $type: String, $tolower: true }, { $unique: true }]
	scores: [{ $type: Number, $cast: true }],
	groups: [{ $type: String, $castTo: ObjectID }, { $purge: true }]
}, options);

var data = {
	name: 'Jane Doe',
	emails: [ 'Jane.Doe@mail.com', 'jane.DOE@mail.com' ],
	scores: [123, 456, '789'],
	groups: ['1234567890abcdef00000000', '1234567890abcdef00000001', '1234abcd'],
	address: '123 Some Street'
};

player.cleanse(data, function (err, res) {
	console.log(res);
	/**
	 * {
	 *		name: 'Jane Doe',
	 *		emails: ['jane.doe@mail.com'],
	 *		scores: [123, 456, 789],
	 *		groups: [
	 *			ObjectID(1234567890abcdef00000000), 
	 *			ObjectID(1234567890abcdef00000001)
	 *		]
	 * }
	 */
});
```

## Usage

```
npm install purity
```

```javascript
var Schema = require('purity').Schema;

var schema = new Schema({ message: { $type: String, $tolower: true } });

var data = { message: 'hElLo, WoRlD!' };

schema.cleanse(data, function (err, res) {
	console.log(res); // { message: 'hello, world!' }
});

```

#### Basic definitions

A schema maps field names to data types:

```javascript

var person = new Schema({ name: { $type: String } });
```

Or simply

```javascript

var person = new Schema({ name: String });
```


Schema fields can be configured with options to mutate and confine incoming data. The following will convert the 'name' field of any input to lower case and only allow strings of less than 5 characters.

```javascript

var schema = new Schema({ 
	name: { $type: String, $tolower: true, $maxlength: 5 }
});`
```


#### Arrays

Coping with arrays is easy, simply place the field's definition in an array.

```javascript

var schema = new Schema({ numbers: [Number] });
```

Array specific options can be placed alongside the field definition or as the second element in the array.

#### Errors

A schema will parse all fields in it's definition but will produce errors for each data point which does not meet the requirements.

```javascript

var schema = new Schema({
	name: { $type: String, $minlength: 6 },
	age: { $type: Number, $required: true },
	houseNumber: { $type: Number, $cast: true }
});

var data = { name: 'John', houseNumber: '111' };

schema.cleanse(data, function (err, res) {
	console.log(err) // { invalid: ['name'], missing: ['age'] }
	console.log(res) // { name: 'John', houseNumber: 111 }
});
```

#### Nested Objects

To declare nested fields, simply nest the definitions inside the required field name.

```javascript

var schema = new Schema({
	name: String,
	address: {
		houseNumber: Number,
		street: String
	}
});
```


#### Data Types

currently supported data types are `String | Number | Boolean`.

support for `Date` will be added in a future release.


#### Re-using schemas

Schemas can be re-used in new definitions

```javascript

var addressSchema = new Schema({ 
	houseNumber: Number, 
	street: String 
});

var personSchema = new Schema({ 
	name: String, 
	age: Number, 
	address: addressSchema 
});

```


## Schema options

Options may be passed as the second argument to a Schmea's constructor.

* `strict: Boolean` - *[default: false] - strip any undeclared fields from the input data*

## General Options

###### `{ $type: Any }`

These options can be combined with any data type.

* `$required: Boolean` - *[default: false] Validation will fail if the field is null or undefined*
* `$default: Any|Function` - *Replaces this field with a default if it is null or undefined. If $default is a function, the return value will be used*
* `$cast: Boolean` - *[default: false] Cast to the required $type*
* `$castTo: Boolean` - *Cast to a different type - the data is passed to the constructor of the new type*
* `$mutate: Function` - *A function which will mutate and return the new value*


#### Array Options

###### `[ { $type: Any } ]`

* `$purge: Boolean` - *Removes invalid elements from the array instead of producing errors*
* `$unique: Boolean` - *Remove duplicates from the array [currently this option will only work with primitive values `String|Number|Boolean`]*
* `$sort: 'asc'|'desc'|Function` - *Sort elements ascending/descending or by a given function*


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


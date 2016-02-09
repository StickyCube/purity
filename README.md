# Purity

Purity is a JSON data validation and transformation tool for web browsers and node.js

It can be installed via:
* [npm](https://www.npmjs.com/package/purity): `npm install purity`
* [bower](http://bower.io/): `bower install purity`

Purity, Inspired by [mongoose](https://www.npmjs.com/package/mongoose),  exposes a schema-based validation API allowing you to apply constraints and transformations to the data in your application.

For usage with express, please see the [express-purity]() package on npm.

## Quickstart Example

Most of the action happens through the Schema object.
```javascript
import { Schema } from 'purity';
```

The following schema expects:
* `title` - A non empty string.
* `tags` - a comma separated string of tags which will be lowercased and split into an array.
* `comments` - An array of objects with properties:
  * `likes` - a non negative number which defaults to 0.
  * `content` - a non empty string not exceeding 255 characters.

```javascript
let toLowercase = v => v.toLowerCase();
let split = v => v.split(',');

const blogPostSchema = Schema({
  title: { $type: String, $required: true },
  tags: { $type: String, $transform: [toLowercase, split] },
  comments: [{
    likes: { $type: Number, $default: 0, $gte: 0 },
    content: { $type: String, $required: true }
  }]
});
```

Validate some data against the schema, using the callback api...
```javascript
let dirtyData = {
  title: 'Stuff about lions',
  tags: 'Lions',
  comments: [
    { likes: 123, content: 'lions r cool' },
    { content: 'w/e' }
  ]
};

blogPostSchema.validate(dirtyData, (err, res) => {
  assert.equal(err, null);
  assert.equal(res, {
    title: 'Stuff about lions',
    tags: ['lions'],
    comments: [
      { likes: 123, content: 'lions r cool' },
      { likes: 0, content: 'w/e' }
    ]
  })
})
```

Or the promise api...
```javascript
let dirtyData = {
  title: 'Spiders',
  tags: 'HAIRY,LEGS',
  comments: [{ content: 'creepy' }]
};

blogPostSchema.validate(dirtyData)
  .catch(handleError)
  .then(handleSuccess);
```

Errors have properties to help you make meaningful messages:

```javascript
let dirtyData = {
  comments: [{ content: 'this one will fail' }]
};

blogPostSchema.validate(dirtyData, function (err, res) {
  assert(err instanceof purity.ValidationError);
  let message = `The blog ${err.path} is ${err.type}`;
  // message -> 'The blog title is missing'
})
```

## API reference

### purity.Types
An object containing the aliases of built in types
* `Types.Any` - a relaxed type with no formal type checks
* `Types.Boolean`
* `Types.String`
* `Types.Number`
* `Types.Date`

___
### purity.Schema(definiton [, options])
Create a re-usable schema to validate data against.

###### Arguments
* `definition` A definition (usually an object) representing the expected data. Detailing type and value constraints, with optional defaults and transformations. See detailed description below for more information.
* `options` - schema options
  * `options.cast {Boolean}` - when true, purity will attempt to cast all properties to their expected types _before_ applying constraints.


###### Returns
A new Schema instance.

___
### Schema definition
The schema definition is a representation of the constraints and transformations you would like to apply to your data.

##### Basics

The definition is plain Obejct with the following format:
```javascript
const definition = {
  /**
   * $type is the only required field.
   * It can be one of purity.Types or an alias for a custom type.
   */
  $type: String,

  /**
   * $required flag defaults to false.
   * Setting this to true will generate errors when
   * the property is null|undefined or an empty string.
   */
  $required: true,

  /**
   * $cast flag determines whether purity will attempt to cast
   * the property to it's declared $type. this overrides schema
   * level cast options and defaults to false.
   */
  $cast: true,

  /**
   * $default can be a static value or a function which yields
   * a default value when the property is null|undefined or
   * an empty string.
   */
  $default: Date.now,

  /**
   * $transform is a mapping function or array of mapping functions
   * which will transform the data.
   */
  $transform: [v => v + 1, v => v - 1, v => 'unnecessary']

  /**
   * More options are available for the built in purity.Types
   * and for custom types which declare constraints
   */
};

const schema = Schema(definiton);
```
However if you only wish to enforce a type, the following is sufficient:
```javascript
const schema = Schema(String);
```

### constraints
The following additional constraints can be applied per type:
#### purity.Types.String
```javascript
{
  // {Number} assert a minimum string length
  $minlength: 123,

  // {Number} assert a maximum string length
  $maxlength: 456,

  // {Number} assert an exact string length
  $fixedwidth: 789,

  // {RegExp} assert a regex .test()
  $regex: /(?:lions|tigers|bears|)+\soh my$/i
}
```
#### purity.Types.Number
```javascript
{
  // {Number} assert greater than
  $gt: 1,

  // {Number} assert greater than || equal
  $gte: 2,

  // {Number} assert less than
  $lt: 3,

  // {Number} assert less than || equal
  $lte: 4,

  // {Number} assert equal
  $eq: 5,

  // {Number} assert not equal
  $neq: (act, opt) => act !== opt
}
```
#### purity.Types.Date
```javascript
{
  // {Date|Number} assert greater than
  $gt: new Date(),

  // {Date|Number} assert less than
  $lt: Date.now()
}
```

###### Arrays
To declare an array, simply wrap the definition in square brackets `[]`.
```javascript
const schema = Schema([{ $type: Date, $required: true }]);
```

###### Nested Objects
For nested objects ...nest them
```javascript
const schema = Schema({
  id: Number,
  some: {
    deeply: {
      nested: {
        data: { $type: Boolean, $default: true }
      }
    }
  }
});
```

___
### purity.createDataType(options)
Declare a data custom data type to be used in a schema.

###### Arguments

`options {Object}` - with properties:
* required:
  * `aliases`
* optional:
  * `check`
  * `cast`
  * `constraints`

`options.aliases {Any|Any[]}` - Identifier(s) fot this data type. The alias(es) declared here will be looked up when used to alias a `$type` in a schema definition.

`options.check {Function (value)}` - a function which is passed the `value` of the property currently being processed and should return a Boolean indicating whether or not it is valid. By default this returns true.

`options.cast {Function (value)}` - a function which maps the `value` of the property currently being processed to your custom data type. Only invoked when the schema level `cast` or type level `$cast` flag is set. By default this is an identity transformation `v => v`.

`options.constraints {Object}` - an object mapping type specific constraint names to predicate functions which enforce them.

**Important notes**: `options.check` is invoked _before_ any casting is applied. The incoming `value` will always be a primitive javascript value. Use this opportunity to reject data that cannot be casted.

# Examples

[](#create-a-data-type-example)
### Creating a data type
Here is an example of how you might create a data type to handle mongodb ObjectIds.

> For those who don't know, an ObjectID is simply a 24 character hex string.


```javascript

import { ObjectID } from 'mongodb';

purity.createDataType({
  // give the type some aliases so we
  // can refer to it in a schema definition
  aliases: [ObjectID, 'objectid'],

  // implement a quick and dirty check
  // to see if it's a valid ObjectID
  check: v => typeof v === 'string' && /[a-zA-Z0-9]{24}/.test(v),

  // provide a method to cast incoming data
  cast: v => new ObjectID(v),

  // A contrived example of adding constraints
  // we're going to check if the ObjectID
  // ends with a particualr sequence
  constraints: {
    endsWith: (value, option) => {
      // value is the incoming data.
      // option is the character we're looking for
      return value.toString().endsWith(option);
    }
  }
});
```

Now let's use it in a schema

```javascript
const schema = Schema(ObejctID, { cast: true });

schema.validate('abcdef0123456789abcdef01', function (e, r) {
  assert.equal(r, ObejctID(abcdef0123456789abcdef01));
});
```

using the endsWith constraint we defined...
```javascript
// we can use the other alias we provided as well
const schema = Schema({ $type: 'objectid', endsWith: '02', $cast: true });

schema.validate('abcdef0123456789abcdef01', function (e, r) {
  // the endsWith constraint causes an error
  assert(e instanceof purity.ValidationError);
});
```

# Bugs and Features
Please log any issues or feature requests on github's [issue tracker](https://github.com/StickyCube/purity/issues).


# Version history
* 0.x - initial release
* 1.0.0
  - Breaking changes, please consult the new api to migrate.
  - removed array options
  - removed many mutations in favour of sequential mapping functions
  - removed `cleanse` alias for `Schema#validate`
  - added Date type
  - added ability to validate primitives and arrays as root level data

# Todo:

- Travis CI
- browser testing
- improve docs
- customisation around error messages
- add some support for array options
  - unique
  - option to ignore errors and remove elements instead
  - constraints on array length

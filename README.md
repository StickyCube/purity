# Purity

Purity is a data validation and transformation tool for wb browsers and node.js

Install via npm or bower
```
npm install purity --save
```

### For the impatient

```javascript
const purity = require('purity');
const schema = purity.Schema({
  my: {
    data: { $type: String, $default: 'spiders' },
    structure: { $type: Number, $required: true, $transform: ['$inc:50'] },
    tags: { $type: String, $transform: ['$split:","'] }
  }
});

// validate some data using a promise ->
schema
  .validate({ my: { structure: 50 } })
  .then(
    res => assert.equal(result, { my: { data: 'spiders', structure: 100 } }),
    err => assert.equal(err, null)
  );

// or using callbacks ->
schema.validate({ my: { structure: 100, tags: 'foo,bar,baz' } }, (err, res) => {
  assert.equal(err, null);
  assert.equal(res, {
    my: {
      data: 'spiders',
      structure: 150,
      tags: ['foo', 'bar', 'baz']
    }
  })
})

// or use with express -> POST { my: { data: 'bugs' } }
app.use('/cooldata', schema);
app.use('/cooldata', function (err, req, res, next) {
  assert(err instanceof purity.ValidationError);
  assert.equal(err.message, 'field my.structure is missing');
  res.status(460).end(err.message);
});
```

# Fast and minimalist streaming CSV parser.

Use it for big data pipelines. Easy to use and fast, with automatic end of line detection. No extra dependencies.

This module converts CSV data to arrays of values. See example.js and tests for examples. 

## Usage

```
const parser = require('./index');

someReadStream
  .pipe(
    parser({}),
  )
  .pipe(new Writable({
    objectMode: true,
    write: (a, b, cb) => {
        // handle the array of fields
        cb();
    },
  }))
  .on('finish', () => {
    console.log('finished parsing CSV');
  });

```

## Options

* delimiter, string, defaults to ```,```
* lineEnding, detected automatically if not set
* skipFirstlLine, boolean, defaults to false

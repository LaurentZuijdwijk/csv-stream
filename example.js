const fs = require('fs');
const { Writable } = require('stream');
const parser = require('./index');

console.time('processCSV');
let totalLines = 0;

fs.createReadStream('./sample-data.csv')
  .pipe(
    parser({
      skipFirstLine: true,
    }),
  )
  .pipe(new Writable({
    objectMode: true,
    write: (arr, b, cb) => {
      totalLines += 1;
      cb();
    },
  }))
  .on('finish', () => {
    console.log('parsed', totalLines, 'lines');
    console.timeEnd('processCSV');
  });

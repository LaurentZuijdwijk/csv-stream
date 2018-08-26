const test = require('tape');
const { PassThrough, Writable } = require('stream');
const parser = require('.');

class Destination extends Writable {
  constructor() {
    super({ objectMode: true });
    this.result = [];
  }

  _write(chunk, encoding, callback) {
    this.result = [...this.result, ...chunk];
    callback();
  }
}

test('test parser', (t) => {
  const destStream = new Destination();
  const readstream = new PassThrough();

  readstream
    .pipe(parser())
    .pipe(destStream)
    .on('finish', () => {
      t.looseEqual(destStream.result, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']);
      t.end();
    });
  
  readstream.write('a,b,c\nd,e,f\n');
  readstream.write('g,h,i\nj,k,l\n');
  readstream.end();
});

test('test parser - skip first line', (t) => {
  const destStream = new Destination();
  const readstream = new PassThrough();

  readstream.pipe(parser({ skipFirstLine: true })).pipe(destStream).on('finish', () => {
    t.looseEqual(destStream.result, ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']);
    t.end();
  });
  readstream.write('a,b,c\nd,e,f\n');
  readstream.write('g,h,i\nj,k,l\n');
  readstream.end();
});

test('test parser - delimiter', (t) => {
  const destStream = new Destination();
  const readstream = new PassThrough();

  readstream.pipe(parser({ delimiter: '|' })).pipe(destStream).on('finish', () => {
    t.looseEqual(destStream.result, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']);
    t.end();
  });
  readstream.write('a|b|c\nd|e|f\n');
  readstream.write('g|h|i\nj|k|l\n');
  readstream.end();
});

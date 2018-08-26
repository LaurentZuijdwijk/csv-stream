const { Transform } = require('stream');

function parser(options = {}) {
  let lastChunkPart = '';
  const delimiter = options.delimiter || ',';
  let { lineEnding } = options;
  const { skipFirstLine } = options;
  let firstLine = true;

  return new Transform({
    readableObjectMode: true,
    transform(chunk, a, cb) {
      chunk = lastChunkPart + chunk.toString();
      lastChunkPart = '';
      if (!lineEnding) {
        lineEnding = getLineEnding(chunk);
      }
      const lines = chunk.split(lineEnding);
      if (lines && lines.length && firstLine && skipFirstLine) {
        firstLine = false;
        lines.shift();
      }
      lastChunkPart = lines.pop();
      for (let i = 0; i < lines.length; i++) {
        this.push(lines[i].split(delimiter));
      }
      cb();
    },
  });
}

function getLineEnding(string) {
  if (string.indexOf('\r\n') > 0) {
    return '\r\n';
  }
  if (string.indexOf('\n') > 0) {
    return '\n';
  }
  if (string.indexOf('\r') > 0) {
    return '\r';
  }
  return null;
}

module.exports = parser;

let stream = require('stream');
let jlto = require('jlto');

module.exports = (options) => {
  let transform = new stream.Transform({
    objectMode: true
  });

  transform._transform = (file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }
    let source = String(file.contents);

    try {
      let result = jlto.optimizeString(source, options);

      file.contents = new Buffer(result);
    } catch (ignored) {}
    callback(null, file);
  };

  return transform;
};

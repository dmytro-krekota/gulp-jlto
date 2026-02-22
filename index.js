let stream = require('stream');
let jlto = require('jlto');

module.exports = (options) => {
  let transform = new stream.Transform({
    objectMode: true,
  });

  transform._transform = (file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }
    let source = String(file.contents);

    Promise.resolve()
      .then(() => jlto.optimizeString(source, options))
      .then((result) => {
        file.contents = Buffer.from(result);
      })
      .catch(() => {})
      .finally(() => callback(null, file));
  };

  return transform;
};

let stream = require('stream')
let jlto = require('jlto')

module.exports = function(options) {
    let stream = new stream.Transform({objectMode: true})

    stream._transform = function(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file)
        }

        let source = String(file.contents)

        try {
            let result = jlto.optimizeString(source, options)

            file.contents = new Buffer(result)
        } catch (ignored) {}
        callback(null, file)
    }

    return stream
}

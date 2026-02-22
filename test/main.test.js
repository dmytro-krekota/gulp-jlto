let assert = require('assert');
let jlto = require('jlto');
let createPlugin = require('../index');

let originalOptimizeString = jlto.optimizeString;

let runPlugin = (file, options) => {
  let plugin = createPlugin(options);

  return new Promise((resolve, reject) => {
    plugin._transform(file, 'utf8', (error, outputFile) => {
      if (error) {
        return reject(error);
      }
      resolve(outputFile);
    });
  });
};

let testCases = [
  {
    name: 'passes null files through unchanged',
    run: async () => {
      let called = false;

      jlto.optimizeString = async () => {
        called = true;

        return 'ignored';
      };

      let file = {
        isNull: () => true,
        contents: Buffer.from('source'),
      };
      let result = await runPlugin(file);

      assert.strictEqual(result, file);
      assert.strictEqual(result.contents.toString(), 'source');
      assert.strictEqual(called, false);
    },
  },
  {
    name: 'optimizes non-null files when optimizer resolves',
    run: async () => {
      jlto.optimizeString = async (source, options) => {
        assert.strictEqual(source, 'source');
        assert.deepStrictEqual(options, {keepComments: false});

        return 'optimized';
      };

      let file = {
        isNull: () => false,
        contents: Buffer.from('source'),
      };
      let result = await runPlugin(file, {keepComments: false});

      assert.strictEqual(result.contents.toString(), 'optimized');
    },
  },
  {
    name: 'keeps original contents when optimizer throws',
    run: async () => {
      jlto.optimizeString = async () => {
        throw new Error('boom');
      };

      let file = {
        isNull: () => false,
        contents: Buffer.from('source'),
      };
      let result = await runPlugin(file);

      assert.strictEqual(result.contents.toString(), 'source');
    },
  },
];

let run = async () => {
  let failures = 0;

  for (let testCase of testCases) {
    try {
      jlto.optimizeString = originalOptimizeString;
      await testCase.run();
      console.log('ok - ' + testCase.name);
    } catch (error) {
      failures += 1;
      console.error('not ok - ' + testCase.name);
      console.error(error && error.stack ? error.stack : error);
    } finally {
      jlto.optimizeString = originalOptimizeString;
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});

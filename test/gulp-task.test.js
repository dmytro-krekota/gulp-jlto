let assert = require('assert');
let fs = require('fs');
let os = require('os');
let path = require('path');
let stream = require('stream');
let util = require('util');
let gulp = require('gulp');
let jlto = require('jlto');
let createPlugin = require('../index');

let fsp = fs.promises;
let finished = util.promisify(stream.finished);
let originalOptimizeString = jlto.optimizeString;

let removeDirectory = async (dirPath) => {
  if (fsp.rm) {
    await fsp.rm(dirPath, {recursive: true, force: true});

    return;
  }

  await fsp.rmdir(dirPath, {recursive: true});
};

let withTempDirectory = async (prefix, fn) => {
  let tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), prefix));

  try {
    await fn(tempRoot);
  } finally {
    await removeDirectory(tempRoot);
  }
};

let runTask = (taskFn) => {
  return new Promise((resolve, reject) => {
    gulp.series(taskFn)((error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

let runTest = async (name, fn) => {
  try {
    jlto.optimizeString = originalOptimizeString;
    await fn();
    console.log('ok - ' + name);
  } catch (error) {
    console.error('not ok - ' + name);
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  } finally {
    jlto.optimizeString = originalOptimizeString;
  }
};

let testOptimizedOutput = async () => {
  await withTempDirectory('gulp-jlto-', async (tempRoot) => {
    let sourceDir = path.join(tempRoot, 'src');
    let outputDir = path.join(tempRoot, 'dist');
    let sourceFilePath = path.join(sourceDir, 'template.html');
    let outputFilePath = path.join(outputDir, 'template.html');

    await fsp.mkdir(sourceDir, {recursive: true});
    await fsp.writeFile(sourceFilePath, 'SOURCE', 'utf8');

    jlto.optimizeString = async (source, options) => {
      assert.strictEqual(source, 'SOURCE');
      assert.deepStrictEqual(options, {strip: true});

      return 'OPTIMIZED';
    };

    let optimizeTask = () => {
      let vinylStream = gulp
        .src(path.join(sourceDir, '*.html'))
        .pipe(createPlugin({strip: true}))
        .pipe(gulp.dest(outputDir));

      return finished(vinylStream);
    };

    await runTask(optimizeTask);

    let output = await fsp.readFile(outputFilePath, 'utf8');

    assert.strictEqual(output, 'OPTIMIZED');
  });
};

let testFallbackOnOptimizeFailure = async () => {
  await withTempDirectory('gulp-jlto-', async (tempRoot) => {
    let sourceDir = path.join(tempRoot, 'src');
    let outputDir = path.join(tempRoot, 'dist');
    let sourceFilePath = path.join(sourceDir, 'template.html');
    let outputFilePath = path.join(outputDir, 'template.html');

    await fsp.mkdir(sourceDir, {recursive: true});
    await fsp.writeFile(sourceFilePath, 'SOURCE', 'utf8');

    jlto.optimizeString = async () => {
      throw new Error('optimizer failed');
    };

    let optimizeTask = () => {
      let vinylStream = gulp
        .src(path.join(sourceDir, '*.html'))
        .pipe(createPlugin())
        .pipe(gulp.dest(outputDir));

      return finished(vinylStream);
    };

    await runTask(optimizeTask);

    let output = await fsp.readFile(outputFilePath, 'utf8');

    assert.strictEqual(output, 'SOURCE');
  });
};

let run = async () => {
  await runTest('runs plugin in a gulp task and writes optimized output', testOptimizedOutput);
  await runTest('keeps original output in gulp task when optimizer fails', testFallbackOnOptimizeFailure);

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
};

run().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});

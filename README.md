# gulp-jlto

[![NPM](https://nodei.co/npm/gulp-jlto.png?downloads=true)](https://nodei.co/npm/gulp-jlto/)

> Optimize jinja like templates with [JLTO](https://www.npmjs.com/package/jlto).

## Install

With [npm](https://www.npmjs.com/package/gulp-jlto) do:

```
npm install gulp-jlto --save-dev
```

## Example

```js
let gulp = require('gulp');
let jlto = require('gulp-jlto');

gulp.task('jlto', () => {
  return gulp
    .src(['src/**/*.nunjucks'])
    .pipe(
      jlto({
        minifyHtml: true,
      })
    )
    .pipe(gulp.dest('build'));
});
```

## Tests

Tests are written using Node's `assert` module. To run them, invoke `npm test`.

## Further Reading

[Why You Should Write Open Source Code and How It Helps Your Career](https://explainme.online/article/why-you-should-write-open-source-code-and-how-it-helps-your-career)

## License

JLTO is available under the [MIT license](https://opensource.org/licenses/MIT), see the LICENSE file for more information.

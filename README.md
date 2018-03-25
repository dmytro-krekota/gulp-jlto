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
                minifyHtml: true
            })
        )
        .pipe(gulp.dest('build'));
});
```
# Support Ukraine 🇺🇦

- Via United24 platform (the initiative of the President of Ukraine):
  - [One click donation (credit card, bank transfer or crypto)](https://u24.gov.ua/)
- Via National Bank of Ukraine:
  - [Ukrainian army](https://bank.gov.ua/en/about/support-the-armed-forces)
  - [Humanitarian aid to Ukraine](https://bank.gov.ua/en/about/humanitarian-aid-to-ukraine)

[#StandWithUkraine](https://twitter.com/hashtag/StandWithUkraine)

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

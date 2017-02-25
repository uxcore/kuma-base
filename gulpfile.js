var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');

var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginInlineUrls = require('less-plugin-inline-urls');
var autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: [
    '> 5%',
    'ie >= 8'
  ]
});
var lessDevConfig = {
  plugins: [
    // LessPluginGlob,
    autoprefixPlugin,
    LessPluginInlineUrls
  ]
};

var themes = [
  {
    name: 'alipay',
    color: {
      brandPrimary: 'rgba(0, 164, 230, 1)',
      brandPrimaryLightAlpha: 'rgba(0, 164, 230, 0.7)',
    },
  },
  {
    name: 'ant_financial',
    color: {
      brandPrimary: 'rgba(0, 160, 232, 1)',
      brandPrimaryLightAlpha: 'rgba(0, 160, 232, 0.7)',
    },
  },
  {
    name: 'ants_daq',
    color: {
      brandPrimary: 'rgba(0, 160, 232, 1)',
      brandPrimaryLightAlpha: 'rgba(0, 160, 232, 0.7)',
    },
  },
  {
    name: 'blue',
    color: {
      brandPrimary: 'rgba(37, 153, 242, 1)',
      brandPrimaryLightAlpha: 'rgba(37, 153, 242, 0.7)',
    },
  },
  {
    name: 'koubei',
    color: {
      brandPrimary: 'rgba(226, 71, 14, 1)',
      brandPrimaryLightAlpha: 'rgba(226, 71, 14, 0.7)',
    },
  },
  {
    name: 'mybank',
    color: {
      brandPrimary: 'rgba(0, 163, 171, 1)',
      brandPrimaryLightAlpha: 'rgba(0, 163, 171, 0.7)',
    },
  },
  {
    name: 'orange',
    color: {
      brandPrimary: 'rgba(243, 115, 39, 1)',
      brandPrimaryLightAlpha: 'rgba(243, 115, 39, 0.7)',
    },
  },
  {
    name: 'zhima_credit',
    color: {
      brandPrimary: 'rgba(46, 182, 169, 1)',
      brandPrimaryLightAlpha: 'rgba(46, 182, 169, 0.7)',
    },
  },
]

gulp.task('makefiles', function () {
  themes.forEach((theme) => {
    gulp.src('./templates/theme.less')
      .pipe(ejs(theme))
      .pipe(rename(`${theme.name}.less`))
      .pipe(gulp.dest('./theme'));
    gulp.src('./templates/*.svg')
      .pipe(ejs(theme))
      .pipe(gulp.dest(`./core/svg/${theme.name}`))
  });
});

gulp.task('server', function () {
  connect.server({
    root: 'demo',
    livereload: true,
    port: 8083
  });
});

gulp.task('dev-html', function () {
  gulp.src('./demo/*.html')
    .pipe(connect.reload());
});

gulp.task('dev-less', function () {
  return gulp.src(['./demo/demo.less'])
    .pipe(less(lessDevConfig))
    .pipe(gulp.dest('./demo/css'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./demo/*.html'], ['dev-html']);
  gulp.watch(['./core/**/*.less', './variables/**/*.less', './demo/demo.less'], ['dev-less']);
});

gulp.task('default', ['server', 'watch', 'dev-less']);
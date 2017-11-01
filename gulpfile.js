const gulp = require('gulp');
const less = require('gulp-less');
const connect = require('gulp-connect');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const assign = require('object-assign');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const LessPluginInlineUrls = require('less-plugin-inline-urls');
const LessPluginFunctions = require('less-plugin-functions');
const autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: [
    '> 5%',
    'ie >= 8'
  ]
});
const lessDevConfig = {
  plugins: [
    // LessPluginGlob,
    autoprefixPlugin,
    LessPluginInlineUrls,
    new LessPluginFunctions(),
  ]
};

const prevHue = 'hsvhue(@brand-primary)';
const prevSat = 'hsvsaturation(@brand-primary)'
const prevValue = 'hsvvalue(@brand-primary)';
const prevColors = {
  brandPrimary: '#f37327',
}

const themes = [
  {
    name: 'orange',
    color: prevColors,
  },
  {
    name: 'blue',
    color: assign({}, prevColors, {
      brandPrimary: '#498EE6',
    }),
  },
  {
    name: 'green',
    color: assign({}, prevColors, {
      brandPrimary: '#40b370',
    })
  },
  {
    name: 'alipay',
    color: assign({}, prevColors, {
      brandPrimary: '#00a0e8',
    }),
  },
  {
    name: 'ant_financial',
    color: assign({}, prevColors, {
      brandPrimary: '#00a0e8',
    }),
  },
  {
    name: 'ants_daq',
    color: assign({}, prevColors, {
      brandPrimary: '#00a0e8',
    }),
  },
  {
    name: 'koubei',
    color: assign({}, prevColors, {
      brandPrimary: '#e2470e',
    }),
  },
  {
    name: 'mybank',
    color: assign({}, prevColors, {
      brandPrimary: '#00a3ab',
    }),
  },
  {
    name: 'zhima_credit',
    color: assign({}, prevColors, {
      brandPrimary: '#2eb6a9',
    }),
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
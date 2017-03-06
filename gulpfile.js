const gulp = require('gulp');
const less = require('gulp-less');
const connect = require('gulp-connect');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const assign = require('object-assign');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const LessPluginInlineUrls = require('less-plugin-inline-urls');
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
    LessPluginInlineUrls
  ]
};

const prevHue = 'hsvhue(@brand-primary)';
const prevSat = 'hsvsaturation(@brand-primary)'
const prevValue = 'hsvvalue(@brand-primary)';
const prevColors = {
  brandPrimary: 'rgba(243, 115, 39, 1)',
  brandPrimaryHover: `hsv(round(${prevHue}), round(${prevSat} - 10%), round(${prevValue}))`,
  brandPrimaryFocus: `hsv(round(${prevHue}), round(${prevSat} + 10%), round(${prevValue}))`,
}

const themes = [
  {
    name: 'orange',
    color: prevColors,
  },
  {
    name: 'blue',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(37, 153, 242, 1)',
      brandPrimaryFocus: `hsv(round(${prevHue}), round(${prevSat}), round(${prevValue} - 8%))`,
    }),
  },
  {
    name: 'green',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(64, 179, 112, 1)',
      brandPrimaryHover: `hsv(round(${prevHue}), round(${prevSat}), round(${prevValue} + 5%))`,
      brandPrimaryFocus: `hsv(round(${prevHue}), round(${prevSat}), round(${prevValue} - 5%))`,
    })
  },
  {
    name: 'alipay',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(0, 164, 230, 1)',
    }),
  },
  {
    name: 'ant_financial',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(0, 160, 232, 1)',
    }),
  },
  {
    name: 'ants_daq',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(0, 160, 232, 1)',
    }),
  },
  {
    name: 'koubei',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(226, 71, 14, 1)',
    }),
  },
  {
    name: 'mybank',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(0, 163, 171, 1)',
    }),
  },
  {
    name: 'zhima_credit',
    color: assign({}, prevColors, {
      brandPrimary: 'rgba(46, 182, 169, 1)',
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
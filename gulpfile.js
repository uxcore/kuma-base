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
  brandPrimary: '#ff6f00',
}

const themes = [
  {
    name: 'orange',
    color: prevColors,
  },
  {
    name: 'blue',
    color: assign({}, prevColors, {
      brandPrimary: '#0079F2',
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
];

const colors = [{
  prefix: 'brand',
  name: ['primary'],
  affix: ['', 'dark-2', 'dark-3', 'dark-4', 'dark-5', 'dark-5', 'dark-6', 'dark-7',
  'alpha-2', 'alpha-3', 'alpha-4', 'alpha-5', 'alpha-6', 'alpha-7', 'alpha-8', 'alpha-9']
}, {
  prefix: ['normal', 'dark', 'white'],
  name: ['alpha'],
  affix: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
}, {
  prefix: 'brand',
  name: ['danger', 'warning', 'success', 'link'],
  affix: ['', 'alpha-2', 'alpha-7', 'alpha-8'],
}];

const generateColors = (colors) => {
  const vars = [];
  colors.forEach((item) => {
    const prefix = Array.isArray(item.prefix) ? item.prefix : [item.prefix];
    const name = Array.isArray(item.name) ? item.name : [item.name];
    const affix = Array.isArray(item.affix) ? item.affix : [item.affix];
    prefix.forEach((p) => {
      name.forEach((n) => {
        affix.forEach((a) => {
          vars.push(`${p}-${n}${a && '-' + a}`)
        })
      })
    })
  });
  return vars;
}

gulp.task('makefiles', function () {
  gulp.src(['./templates/text-color.less'])
    .pipe(ejs({
      colors: generateColors(colors),
    }))
    .pipe(gulp.dest('./core'));
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
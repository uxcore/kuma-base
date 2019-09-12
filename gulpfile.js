const gulp = require('gulp');
const less = require('gulp-less');
const connect = require('gulp-connect');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const assign = require('object-assign');
const Less = require('less');
const rimraf = require('rimraf');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const LessPluginInlineUrls = require('less-plugin-inline-urls');
const LessPluginFunctions = require('less-plugin-functions');
const fs = require('fs');
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
      brandPrimary: '#FF4C19',
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
  affix: ['', 'hover', 'focus', 'dark-4', 'dark-5', 'dark-5', 'dark-6', 'dark-7',
    'alpha-2', 'alpha-3', 'alpha-4', 'alpha-5', 'alpha-6', 'alpha-7', 'alpha-8', 'alpha-9']
}, {
  prefix: ['normal', 'dark', 'white'],
  name: ['alpha'],
  affix: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
}, {
  prefix: 'brand',
  name: ['danger', 'warning', 'success', 'link', 'info', 'query'],
  affix: ['']
}, {
  prefix: 'brand',
  name: ['danger', 'warning', 'success', 'link'],
  affix: ['', 'alpha-2', 'alpha-7', 'alpha-8'],
}, {
  prefix: 'brand',
  name: ['danger'],
  affix: ['hover', 'focus'],
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
          vars.push({
            className: `${p === 'brand' ? '' : p + '-'}${n}${a && '-' + a}`,
            colorName: `${p}-${n}${a && '-' + a}`
          })
        })
      })
    })
  });
  return vars;
}

gulp.task('makefiles', function () {
  gulp.src(['./templates/text-color.less', './templates/background-color.less', './templates/border-color.less'])
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

const getVariablesFromLess = (files = []) => {
  const lessVariables = {};
  files.forEach((file) => {
    const filePath = `./variables/${file}.less`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matches = fileContent.match(/@(.+):/g);
    matches.forEach((item) => {
      lessVariables[item.replace(/[:@]/g, '')] = true;
    })
  });
  return lessVariables;
}

const getThemes = () => {
  const files = fs.readdirSync('./theme');
  return files.map(file => file.replace('.less', ''));
}

gulp.task('js-vars', function () {
  const vars = getVariablesFromLess(['border', 'colors', 'shadow', 'size', 'transition', 'typography', 'svg']);
  let themeFinished = 0;
  const themes = getThemes();
  themes.forEach((theme) => {
    gulp.src('./templates/extract-vars.less')
      .pipe(ejs({
        vars: Object.keys(vars),
        theme: theme,
      }))
      .pipe(less(lessDevConfig))
      .pipe(rename(`${theme}.css`))
      .pipe(gulp.dest('./jsvars'))
      .on('end', function () {
        themeFinished += 1;
        if (themeFinished === themes.length) {
          themes.forEach((th) => {
            const cssFile = fs.readFileSync(`./jsvars/${th}.css`, 'utf8');
            const matches = cssFile.match(/\.(.+) {\n\s+color: (.+)\n}/g);
            const varsArr = [];
            matches.forEach((match) => {
              match.replace(/\.(.+) {\n\s+color: (.+);\n}/, (match, $1, $2) => {
                varsArr.push({ key: `@${$1}`, value: $2 })
              })
            });
            gulp.src('./templates/extract-vars.js')
              .pipe(ejs({
                vars: varsArr
              }))
              .pipe(rename(`${th}.js`))
              .pipe(gulp.dest('./jsvars'))
              .on('end', () => {
                rimraf(`./jsvars/${th}.css`, () => { });
              });
          })
        }
      })
  });
});

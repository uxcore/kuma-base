var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');

var LessPluginAutoPrefix = require('less-plugin-autoprefix');
// var LessPluginGlob = require('less-plugin-glob');
var LessPluginInlineUrls = require('less-plugin-inline-urls');
var autoprefixPlugin = new LessPluginAutoPrefix({browsers: [
    '> 5%',
    'ie >= 8'
]});
var lessDevConfig = {
    plugins: [
        // LessPluginGlob,
        autoprefixPlugin,
        LessPluginInlineUrls
    ]
};

gulp.task('server', function(){
    connect.server({
        root: 'demo',
        livereload: true,
        port: 8083
    });
});

gulp.task('dev-html', function(){
    gulp.src('./demo/*.html')
        .pipe(connect.reload());
});

gulp.task('dev-less', function(){
    return gulp.src(['./demo/demo.less'])
		.pipe(less(lessDevConfig))
		.pipe(gulp.dest('./demo/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(['./demo/*.html'], ['dev-html']);
    gulp.watch(['./core/**/*.less', './variables/**/*.less', './demo/demo.less'], ['dev-less']);
});

gulp.task('default', ['server', 'watch']);
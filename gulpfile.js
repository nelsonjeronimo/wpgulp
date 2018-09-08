
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var browserSync = require('browser-sync').create();

// varibles for the paths
const 
    dir = {
        src :   'src/',
        dist:   'dist/'
    };

// other variables
var projectURL  =   'project.test';

// SASS to CSS, minified, cleaned, sourcemapped, autoprefixed
gulp.task('sass', function() {

    var theme = gulp.src(dir.src+'theme/assets/scss/**/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.init())
                .pipe(autoprefixer() )
                .pipe(cleanCSS({compatibility: 'ie9'}))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(dir.dist+'theme/assets/css'));
    
    var plugin = gulp.src(dir.src+'plugin/assets/scss/**/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.init())
                .pipe( autoprefixer() )
                .pipe(cleanCSS({compatibility: 'ie9'}))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(dir.dist+'plugin/assets/css'));

    return merge(theme, plugin);

});

// JS minify
gulp.task('js', function() {

    var theme = gulp.src(dir.src+'theme/assets/js/**/*.js')
                .pipe(uglify())
                .pipe(gulp.dest(dir.dist+'theme/assets/js'));

    var plugin = gulp.src(dir.src+'plugin/assets/js/**/*.js')
                .pipe(uglify())
                .pipe(gulp.dest(dir.dist+'plugin/assets/js'));
    
    return merge(theme, plugin);
});

// Compress Images
gulp.task('images', function() {

    var theme = gulp.src(dir.src+'theme/assets/images/**/*.*')
                .pipe(imagemin())
                .pipe(gulp.dest(dir.dist+'theme/assets/images'));

    var plugin = gulp.src(dir.src+'plugin/assets/images/**/*.*')
                .pipe(imagemin())
                .pipe(gulp.dest(dir.dist+'plugin/assets/images'));
    
    return merge(theme, plugin);
});

// Fonts
gulp.task('fonts', function() {

    var theme = gulp.src(dir.src+'theme/assets/fonts/**/*.*')
                .pipe(gulp.dest(dir.dist+'theme/assets/fonts'));

    var plugin = gulp.src(dir.src+'plugin/assets/fonts/**/*.*')
                .pipe(gulp.dest(dir.dist+'plugin/assets/fonts'));
    
    return merge(theme, plugin);
});

// Copy files
gulp.task('files', function() {
    var themeroot = gulp.src(dir.src+'theme/*.*')
                    .pipe(gulp.dest(dir.dist+'theme/'));
    
    var themelang = gulp.src(dir.src+'theme/languages/**/*.*')
                    .pipe(gulp.dest(dir.dist+'theme/languages/'));
         
    var pluginroot = gulp.src(dir.src+'plugin/*.*')
                     .pipe(gulp.dest(dir.dist+'plugin/'));  

    var pluginlang = gulp.src(dir.src+'plugin/languages/**/*.*')
                     .pipe(gulp.dest(dir.dist+'plugin/languages/'));
    
    return merge(themeroot, pluginroot, themelang, pluginlang);
});

// Browsersync
gulp.task( 'browser-sync', function() {
    browserSync.init( {

      proxy: projectURL,
      // `true` Automatically open the browser with BrowserSync live server.
      // `false` Stop the browser from automatically opening.
      open: true,

      // Use a specific port (instead of the one auto-detected by Browsersync).
      //port: 7000,
  
    } );
  });

  //Watch tasks
  gulp.task('default', gulp.parallel('sass', 'js', 'images', 'fonts', 'files', function() {
    gulp.watch( dir.src+'**/*.php', reload ); // Reload on PHP file changes.
    gulp.watch( dir.src+'**/*.scss', [ 'sass' ] ); // Reload on SCSS file changes.
    gulp.watch( dir.src+'**/*.js', [ 'js', reload ] ); // Reload on vendorsJs file changes.
  }));

//Build task
gulp.task('build', gulp.parallel('sass', 'js', 'images', 'fonts', 'files') );
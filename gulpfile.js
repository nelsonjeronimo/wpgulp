
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
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

var sass = {
    opts: {
        outputStyle     : 'nested',
        imagePath       : images.build,
        precision       : 3,
        errLogToConsole : true        
    }
}
gulp.task('sass', function() {

   return gulp.src(dir.src+'assets/scss/**/*.scss')
            .pipe(sass(sass.opts).on('error', sass.logError))
            .pipe(sourcemaps.init())
            .pipe( autoprefixer())
            .pipe(cleanCSS({compatibility: 'ie9'}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dir.dist+'assets/css'));
});

// JS minify
gulp.task('js', function() {
    return gulp.src(dir.src+'assets/js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest(dir.dist+'assets/js'));
});

// Compress Images
gulp.task('images', function() {
    return gulp.src(dir.src+'assets/images/**/*.*')
            .pipe(newer(dis.dist+'assets/images/**/*'))
            .pipe(imagemin())
            .pipe(gulp.dest(dir.dist+'assets/images'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(dir.src+'assets/fonts/**/*.*')
            .pipe(newer(dir.dist+'assets/fonts/'))
            .pipe(gulp.dest(dir.dist+'assets/fonts'));
});

// Copy files
gulp.task('files', function() {
    var themeroot = gulp.src(dir.src+'*.*')
                    .pipe(gulp.dest(dir.dist));
    
    var themelang = gulp.src(dir.src+'languages/**/*.*')
                    .pipe(gulp.dest(dir.dist+'languages/'));

    var phpfiles = gulp.src(dir.src+'**/*.php')
                    .pipe(gulp.dest(dir.dist));
    
    return merge(themeroot, themelang, phpfiles);
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
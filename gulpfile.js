// NPM Modules //////////////////////////////////////////////////
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();

// Custom folder variables //////////////////////////////////////
var folderSrc = 'src/',
	folderDist = 'dist/';

// Tasks ////////////////////////////////////////////////////////

gulp.task('browser-sync', function() {
	browserSync.init({
		browser: "chromium-browser", // doesn't start chromium so far on my machine, but prevents firefox from starting :)
		proxy: "localhost"
	});
});

gulp.task('sass', function() {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		folderSrc + 'styles/custom.scss'
		])
		.pipe(concat('all-styles.scss'))
		.pipe(sass({style: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cssnano()) // disable for development with big files
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('compileJS',function() {
	return gulp.src( [
		'node_modules/somescript.min.js',
		folderSrc + 'js/custom.js'
	])
		.pipe(concat('all-scripts.js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('watch', function() {
	gulp.watch( folderSrc  + 'js/!**.*', ['compileJS']);
	gulp.watch( folderSrc  + 'styles/**.*', ['sass']);
	gulp.watch("*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['browser-sync','sass', 'compileJS', 'watch']);
/********************************************* NPM Modules **********************************************/
var gulp = require('gulp'),
	fs = require('fs'),
	sass = require('gulp-sass')(require('sass')),
	concat = require('gulp-concat'),
	svgmin = require('gulp-svgmin'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	babel = require('gulp-babel'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create();


/********************************************* Custom folder variables ***********************************/
var folderSrc = 'site/templates/src/',
	folderDist = 'site/templates/dist/';

/********************************************* Default Tasks *********************************************/

function startBrowsersync() {
	browserSync.init({
		open: false,
		proxy: "localhost"
	});
}
function cssVendors() {
	return gulp.src([
		'node_modules/modern-normalize/modern-normalize.css',
		'node_modules/slick-carousel/slick/slick.css'
	])
		.pipe(concat('vendor-css.scss'))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // possible outputStyles: nested, expanded, compact, compressed
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
}

function sassFunction() {
	return gulp.src([
		folderSrc + 'styles/custom.scss'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('custom-compiled-from-sass.scss'))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // possible outputStyles: nested, expanded, compact, compressed
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
}

function compileVendorJS() {
	return gulp.src( [
		'node_modules/jquery/dist/jquery.js',
		'node_modules/slick-carousel/slick/slick.min.js',
		'node_modules/slick-carousel/slick/slick.min.js'
	])
		.pipe(concat('all-vendor-scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
}

function compileCustomJS() {
	return gulp.src([
		folderSrc + 'js/custom.js'
	])
		.pipe(concat('custom-babelified.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
}

function svgmin() {
	return gulp.src( folderSrc + 'img/*.svg')
		.pipe(svgmin({
			plugins: [{
				removeStyleElement: true
			}]
		}))
		.pipe(gulp.dest(folderDist + 'img/'))
}

function antiCache(cb) {
	return fs.writeFile(folderSrc + 'version/nr.txt', new Date().toJSON(), cb);
}

const { watch, series, parallel } = require('gulp');
const startCompile = gulp.parallel(compileVendorJS, sassFunction, compileCustomJS, antiCache, cssVendors);
const startBrowsersync1 = startBrowsersync;

exports.default = function() {
	startCompile();
	startBrowsersync1();
	watch(folderSrc + 'styles/*.scss', parallel(sassFunction, antiCache));
	watch( folderSrc  + 'js/**.*', parallel(compileCustomJS, antiCache));
	watch( folderSrc + 'images/!*.svg', parallel(svgmin));
	watch(folderSrc + 'markup/*.php', parallel(antiCache));
};

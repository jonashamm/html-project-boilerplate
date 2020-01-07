/********************************************* NPM Modules **********************************************/
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	babel = require('gulp-babel'),
	autoprefixer = require('gulp-autoprefixer'),
	imageResize = require('gulp-image-resize'),
	browserSync = require('browser-sync').create(),
	image = require('gulp-image'),
	exec = require('gulp-exec');
var exec = require('child_process').exec;


/********************************************* Custom folder variables ***********************************/
var folderSrc = 'src/',
	folderDist = 'dist/';

/********************************************* Default Tasks *********************************************/

function startBrowsersync() {
	browserSync.init({
		open: false,
		proxy: "localhost"
	});
}
function startBrowsersyncLaravel() {
	browserSync.init({
		open: false,
		ghostMode: false,
		proxy: {
			target: '0.0.0.0:8000',
			reqHeaders: function() {
				return {
					host: 'localhost:3000'
				};
			}
		}
	});
}


function sassFunction() {
	return gulp.src([
		folderSrc + 'styles/custom.scss'
	])
		.pipe(concat('custom-compiled-from-sass.scss'))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // possible outputStyles: nested, expanded, compact, compressed
		.pipe(autoprefixer())
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
}

function compileVendorJS() {
	return gulp.src( [
		'node_modules/jquery/dist/jquery.js',
		// 'node_modules/vue/dist/vue.js',
		// 'node_modules/axios/dist/axios.js',
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

function antiCacheHead() {
	return gulp.src(folderSrc + 'markup/head.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest(folderDist));
}
function antiCacheFoot() {
	return gulp.src(folderSrc + 'markup/foot.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest(folderDist));
}

function copyCssNormalize() {
	return gulp.src('node_modules/modern-normalize/modern-normalize.css')
		.pipe(gulpCopy(folderDist))
}


const { watch, series, parallel } = require('gulp');
const startCompile = gulp.parallel(compileVendorJS, sassFunction, compileCustomJS, antiCacheHead, antiCacheFoot);
const startBrowsersync1 = startBrowsersync;

exports.default = function() {
	startCompile();
	startBrowsersync1();
	watch(folderSrc + 'styles/*.scss', parallel(sassFunction, antiCacheHead));
	watch( folderSrc  + 'js/**.*', parallel(compileCustomJS, antiCacheFoot));
	watch( folderSrc + 'images/!*.svg', parallel(svgmin));
	watch(folderSrc + 'markup/*.php', parallel(antiCacheHead,antiCacheFoot));
};

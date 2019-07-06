/********************************************* NPM Modules **********************************************/
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	babel = require('gulp-babel'),
	replace = require('gulp-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	imageResize = require('gulp-image-resize'),
	image = require('gulp-image'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync').create(),
	shell = require('gulp-shell');


/********************************************* Custom folder variables ***********************************/
var folderSrc = 'src/',
	folderDist = 'dist/';

/********************************************* Default Tasks *********************************************/

gulp.task('browser-sync', function() {
	browserSync.init({
		open: false,
		proxy: "localhost"
	});
});

gulp.task('sass', function() {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		folderSrc + 'styles/custom.scss'
	])
		.pipe(concat('all-styles.scss'))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // possible outputStyles: nested, expanded, compact, compressed
		.pipe(autoprefixer())
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('compileVendorJS',function() {
	return gulp.src( [
		'node_modules/jquery/dist/jquery.js',
		'node_modules/vue/dist/vue.js',
		'node_modules/axios/dist/axios.js',
	])
		.pipe(concat('all-vendor-scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('compileCustomJS',function() {
	return gulp.src([
		folderSrc + 'js/custom.js'
	])
		.pipe(concat('custom-babelified.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('svgmin', function () {
	return gulp.src( folderSrc + 'img/*.svg')
		.pipe(svgmin({
			plugins: [{
				removeStyleElement: true
			}]
		}))
		.pipe(gulp.dest(folderDist + 'img/'))
});

gulp.task('antiCacheHead', function () {
	return gulp.src(folderSrc + 'markup/head.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest(folderDist));
});
gulp.task('antiCacheFoot', function () {
	return gulp.src(folderSrc + 'markup/foot.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest(folderDist));
});


gulp.task('watch', function() {
	gulp.watch( folderSrc  + 'styles/**.*', ['sass','antiCacheHead']);
	gulp.watch( folderSrc  + 'js/**.*', ['compileCustomJS', 'antiCacheFoot']);
	gulp.watch( folderSrc + 'img/*.svg', ['svgmin']);
	gulp.watch( folderSrc + 'markup/*.php', ['antiCacheHead', 'antiCacheFoot']).on('change', browserSync.reload);
});


// Type in gulp on terminal/console to start standard tasks
gulp.task('default', ['antiCacheHead', 'antiCacheFoot', 'browser-sync', 'sass', 'compileVendorJS', 'compileCustomJS', 'svgmin', 'watch']);


/********************************************* Special Tasks *********************************************/
// new image sizes
function makeJpgVersions($width,$height,$suffix) {
	gulp.src(folderSrc + 'img/*.jpg')
		.pipe(imageResize({
			width : $width,
			height : $height,
			crop : true,
			upscale : true
		}))
		.pipe(rename({
			suffix: $suffix
		}))
		.pipe(gulp.dest(folderDist + 'dist/img'));
}
gulp.task('images', function () {
	makeJpgVersions(640,525,"-small");
	makeJpgVersions(1280,570,"-middle");
	makeJpgVersions(1920,670,"-big");
});

// Optimize images with by google recommended filters
gulp.task('imageOptim', function () {
	gulp.src( folderSrc + 'images/**/*.jpg' )
		.pipe(image())
		.pipe(gulp.dest( folderDist + 'images' ));
});
/********************************************* NPM Modules **********************************************/
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	imageResize = require('gulp-image-resize'),
	browserSync = require('browser-sync').create();

/********************************************* Custom folder variables ***********************************/
var folderSrc = 'src/',
	folderDist = 'dist/';

/********************************************* Default Tasks *********************************************/

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
			browsers: ['last 10 versions'],
			cascade: false,
			stats: { browsers: ["> 0.001%"]}
		}))
		// .pipe(cssnano()) // disable for development with big files
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('compileJS',function() {
	return gulp.src( [
		folderSrc + 'js/custom.js'
	])
		.pipe(concat('all-scripts.js'))
		// .pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('svgmin', function () {
	return gulp.src( folderSrc + 'img/ui/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest(folderDist + 'img/ui/'))
});

gulp.task('antiCache', function () {
	return gulp.src('src/markup/index.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch( folderSrc  + 'js/**.*', ['compileJS','antiCache']);
	gulp.watch( folderSrc  + 'styles/**.*', ['sass','antiCache']);
	gulp.watch( folderSrc + 'img/ui/*.svg', ['svgmin']);
	gulp.watch("src/markup/*.php", ['antiCache']).on('change', browserSync.reload);
});

// Type in gulp on terminal/console to start standard tasks
gulp.task('default', ['browser-sync', 'sass', 'antiCache', 'compileJS', 'svgmin', 'watch']);




/********************************************* Special Tasks *********************************************/
function makeJpgVersions($width,$height,$suffix) {
	gulp.src('src/img/*.jpg')
		.pipe(imageResize({
			width : $width,
			height : $height,
			crop : true,
			upscale : false
		}))
		.pipe(rename({
			suffix: $suffix
		}))
		.pipe(gulp.dest('dist/img'));
}

gulp.task('images', function () {
	makeJpgVersions(640,525,"-small");
	makeJpgVersions(1280,570,"-middle");
	makeJpgVersions(1920,670,"-big");
});
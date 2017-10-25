/********************************************* NPM Modules **********************************************/
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	replace = require('gulp-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	imageResize = require('gulp-image-resize'),
	image = require('gulp-image'),
	realFavicon = require ('gulp-real-favicon'),
	browserSync = require('browser-sync').create(),
	shell = require('gulp-shell'),
	packagejson = require('./package.json');


/********************************************* Custom folder variables ***********************************/
var folderSrc = 'src/',
	folderDist = 'dist/';

/********************************************* Variables for Favicon generators ***********************************/
var themeColor = '#000000', // Todo: if you are using the favicon generator task, set your theme colors here
	secondaryThemeColor = '#ffffff',
	applicationName = packagejson.name, // untested
	faviconSrcImage = 'resources/assets/images/favicon/favicon.svg',
	whereToPutCompiledFavicons = '';

/********************************************* Default Tasks *********************************************/

gulp.task('browser-sync', function() {
	browserSync.init({
		open: false,
		proxy: "localhost"
	});
});

gulp.task('startWebpack', shell.task([
	'webpack --watch'
]));

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
		.pipe(gulp.dest(folderDist))
		.pipe(browserSync.stream());
});

gulp.task('svgmin', function () {
	return gulp.src( folderSrc + 'img/ui/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest(folderDist + 'img/ui/'))
});

gulp.task('antiCache', function () {
	return gulp.src(folderSrc + 'markup/index.php')
		.pipe(replace('antiCacheString', Date.now()))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch( folderSrc  + 'styles/**.*', ['sass','antiCache']);
	gulp.watch( folderSrc + 'img/ui/*.svg', ['svgmin']);
	gulp.watch("src/markup/*.php", ['antiCache']).on('change', browserSync.reload);
});

// Type in gulp on terminal/console to start standard tasks
gulp.task('default', ['antiCache', 'browser-sync', 'sass', 'startWebpack', 'svgmin', 'watch']);


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

// Favicon
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: faviconSrcImage,
		dest: whereToPutCompiledFavicons,
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: secondaryThemeColor,
				margin: '25%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: secondaryThemeColor,
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'backgroundAndMargin',
				margin: '29%',
				backgroundColor: secondaryThemeColor,
				themeColor: secondaryThemeColor,
				manifest: {
					name: applicationName,
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: themeColor
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
	return gulp.src([ folderSrc + 'index.php' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest( folderSrc + 'index.php.faviconed'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

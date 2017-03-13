// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build dependencies
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var del = require('del');

// Style dependencies
var sass= require('gulp-sass');
var cssnano = require('gulp-cssnano');

// Development dependencies
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

// Asset dependencies
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

//runs sass, browserSync and watch tasks (for development)
gulp.task('default', function (callback){
	runSequence(['sass','browserSync', 'watch'],
		callback
)});
//runs sass, css, images and font tasks (for FTP uploads)
gulp.task('build', function (callback){
	runSequence('clean:dist',
		['sass', 'css', 'scripts', 'html', 'server', 'jsLibs', 'images'],
		callback
)});

// task to clean dist folder (delete old files)
gulp.task('clean:dist', function(){
	return del.sync('dist');
});
//task to optimise images + put them in dist folder
gulp.task('images', function(){
	return gulp.src('app/public/assets/**/*.+(png|jpg|gif|svg|mp4|ogv|ogg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/assets'))
});
//task to copy fonts to dist folder
gulp.task('fonts', function(){
	return gulp.src('app/public/fonts/**/*')
	.pipe(gulp.dest('dist/public/public/fonts'))
});
//task to turn sass into css and then reload browser
gulp.task('sass', function(){
	return gulp.src('app/public/scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('app/public/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

// our gulp-nodemon task
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app/index.js'
	}).on('start', function () {
		//avoid nodemon being started multiple times
		console.log("server started");
		setTimeout(function(){
			browserSync.reload();
		}, 2000);
		if (!started) {
			cb();
			started = true;
		}
	})
	.on('crash', function() {
		// console.log('nodemon.crash');
	})
	.on('restart', function() {
		console.log('nodemon.restart');
		// browserSync.reload();
	})
	.once('quit', function () {
		// handle ctrl+c without a big weep
		process.exit();
	});
});

gulp.task('browserSync', ['nodemon'], function() {
	browserSync.init({
		proxy: "localhost:3000",
		port: 4000,
	});
	console.log("Browser sync is working");
});

gulp.task('distTest', function(cb) {

	browserSync.init({
		proxy: "localhost:3000",
		port: 4000,
	});
	console.log("Browser sync is working");

	var started = false;
	return nodemon({
		script: 'dist/index.js'
	}).on('start', function () {
		//avoid nodemon being started multiple times
		console.log("server started");
		setTimeout(function(){
			browserSync.reload();
		}, 2000);
		if (!started) {
			cb();
			started = true;
		}
	})
	.on('crash', function() {
		// console.log('nodemon.crash');
	})
	.on('restart', function() {
		console.log('nodemon.restart');
		// browserSync.reload();
	})
	.once('quit', function () {
		// handle ctrl+c without a big weep
		process.exit();
	});
});

gulp.task('jsLibs', function(){
	return gulp.src('app/public/js/lib/*.js')
	// .pipe(concat('libraries.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/public/js/lib'));
});

gulp.task('scripts', function(){
	return gulp.src('app/public/js/*.js')
	// .pipe(concat('main.min.js'))
	.pipe(babel({
		presets: ['es2015']
	}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/public/js'));
});

gulp.task('html', function(){
	return gulp.src('app/public/views/*.pug')
	.pipe(gulp.dest('dist/public/views'));
});

gulp.task('server', function(){
	return gulp.src('app/*.js')
	.pipe(gulp.dest('dist'));
});

//task to get all css files referenced in html file and output all new files to dist
gulp.task('css', function () {
  return gulp.src('app/public/css/*.css')
    // .pipe(concatCss('styles.min.css'))
    .pipe(gulp.dest('dist/public/css'));
});

//task that 'watches' once browser sync and sass have been run
//gulp then watches for any change in scss to activate sass task
//gulp does the same for html and any js change and updates the browser
gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/public/scss/**/*.scss', ['sass']);
	gulp.watch('app/public/views/*.pug', browserSync.reload);
	gulp.watch('app/public/js/**/*.js', browserSync.reload);
	gulp.watch('app/*.js', browserSync.reload);
});

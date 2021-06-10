var packageInfo = require('./package.json');
var gulp = require('gulp');
var rename = require("gulp-rename");
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var zip = require('gulp-zip');

// minifies javascript and css
gulp.task('min', function() {
	console.log('min task start');
	var suffix = '-' + packageInfo.version + '.min';
	
	// return promise
	return new Promise(function(resolve, reject){
		
		// distributes javascript source
		gulp.src(['src/duice.js','src/duice-*.js'])
			.pipe(gulp.dest('dist'))
			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(rename({suffix:suffix}))
			.pipe(gulp.dest('dist'));
		
		// distributes css source
		gulp.src(['src/duice.css','src/duice-*.css'])
			.pipe(gulp.dest('dist'))
			.pipe(cleanCss())
			.pipe(rename({suffix:suffix}))
			.pipe(gulp.dest('dist'));
		
		gulp.src(['src/duice.html','src/duice-*.html'])
			.pipe(gulp.dest('dist'));
		
		// copy external source
		gulp.src('src/polyfill/**/*').pipe(gulp.dest('dist/polyfill'));
		gulp.src('src/integrate/**/*').pipe(gulp.dest('dist/integrate'));

		// resolve
		resolve();
	});
	console.log('min task end');
});

// compress javascript and css
gulp.task('zip', function() {
	console.log('zip task start');
	var suffix = '-' + packageInfo.version + '.min';
	
	// return promise
	return new Promise(function(resolve, reject){
		
		// compress ZIP file
		gulp.src(['dist/**/*.js','dist/**/*.css'])
			.pipe(zip('duice-' + packageInfo.version + '.zip'))
			.pipe(gulp.dest('dist'));
		
		// resolve
		resolve();
	});
	console.log('zip task end');
});




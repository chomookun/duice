var packageInfo = require('./package.json');
var gulp = require('gulp');
var rename = require("gulp-rename");
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var zip = require('gulp-zip');

// compress javascript and css
gulp.task('zip', function() {
	console.log('zip task start');
	var suffix = '-' + packageInfo.version + '.min';
	
	// return promise
	return new Promise(function(resolve, reject){
		
		// compress ZIP file
		gulp.src(['src/**/*.*'])
			.pipe(zip('duice-' + packageInfo.version + '.zip'))
			.pipe(gulp.dest('dist'));
		
		// resolve
		resolve();
	});
	console.log('zip task end');
});



const gulp = require('gulp');
const concat = require('gulp-concat');

// merge css
gulp.task('mergeCss', function(){
	return new Promise(function(resolve, reject){
		gulp.src('src/**/*.css')
			.pipe(concat('duice.css'))
			.pipe(gulp.dest('dist'));
		resolve();
	});
		
});


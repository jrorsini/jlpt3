var gulp = require('gulp'), 
	sass = require('gulp-sass'), 
	livereload = require('gulp-livereload')

var glob = ['js/*.js','*.html','css/*.sass','css/*.css'];

gulp.task('livereload', function() {
	return gulp.src(glob).pipe(livereload());
});

gulp.task('sass', function() {
	return gulp.src('css/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'))
		.pipe(livereload());
});

gulp.task('default', function(){
	livereload.listen();
	gulp.watch(glob, ['sass','livereload']);
});
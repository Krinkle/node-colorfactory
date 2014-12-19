module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-karma');

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: true
			},
			all: ['*.js', '{src,test}/*.js']
		},
		jscs: {
			all: '<%= jshint.all %>'
		},
		karma: {
			main: {
				options: {
					frameworks: ['qunit'],
					files: [
						'src/ColorHelper.js',
						'src/ColorFactory.js',
						'lib/jquery.js',
						'test/testinit.js',
						'test/ColorHelper.test.js',
						'test/ColorFactory.test.js'
					],
					singleRun: true,
					autoWatch: false,
					browsers: ['PhantomJS', 'Firefox']
				}
			}
		}
	});

	grunt.registerTask('test', ['jshint', 'karma', 'jscs']);
	grunt.registerTask('default', 'test');
};

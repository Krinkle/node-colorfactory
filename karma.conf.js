/* eslint-env node */
module.exports = function (config) {
	config.set({
		browsers: ['FirefoxHeadless'],
		frameworks: ['qunit'],
		files: [
			'src/ColorHelper.js',
			'src/ColorFactory.js',
			'test/testinit.js',
			'test/ColorHelper.test.js',
			'test/ColorFactory.test.js'
		],
		autoWatch: false,
		singleRun: true,
		reporters: ['dots']
	});
};

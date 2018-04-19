/* eslint-env node */
module.exports = function (config) {
	config.set({
		customLaunchers: {
			// Chrome does not support --no-sandbox inside Docker
			// https://github.com/travis-ci/docs-travis-ci-com/blob/c1da4af0/user/chrome.md#sandboxing
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			}
		},
		browsers: [process.env.CI ? 'ChromeHeadlessNoSandbox' : 'ChromeHeadless'],
		frameworks: ['qunit'],
		files: [
			'src/ColorHelper.js',
			'src/ColorFactory.js',
			'lib/jquery.js',
			'test/testinit.js',
			'test/ColorHelper.test.js',
			'test/ColorFactory.test.js'
		],
		autoWatch: false,
		singleRun: true,
		reporters: ['dots']
	});
};

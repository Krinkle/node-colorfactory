/* eslint-env qunit */
/* global eachKeyed, eachFmt */

QUnit.module('ColorFactory');

QUnit.test('primaryColors()', function (assert) {
	assert.colorArrayCloseTo(ColorFactory.primaryColors(), ['yellow', 'red', 'blue']);
});

QUnit.test('primaryAndSecondaryColors()', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.primaryAndSecondaryColors(),
		['yellow', 'Orange', 'red', '#90f', 'blue', '#0f6']
	);
});

QUnit.test.each('complementaryColors()', eachKeyed(0, [
	['#ff0000', '#00ffff'],
	['#0338ff', '#ff9d04'],
	['#9e01d6', '#3ad501']
]), function (assert, [input, expected]) {
	assert.colorArrayCloseTo(
		ColorFactory.complementary(input),
		[expected, input]
	);
});

QUnit.test.each('analogous', eachKeyed(1, [
	['#6d00ff', '#0000ff', '#0090ff'],
	['#ff7400', '#ff0000', '#cd0074'],
	['#9fee00', '#ffff00', '#ffd300'],
	['#19d408', '#96fe04', '#EAFF04'],
	['#FE0435', '#FC04C5', '#8B16FB'],
	['#FF7590', '#FD74DF', '#BF7EFD'],
	['#0a8ccd', '#04FBD1', '#04fb56']
]), function (assert, item) {
	assert.colorArrayCloseTo(
		ColorFactory.analogous(item[1]),
		item
	);
});

QUnit.test.each('analogous', eachFmt('from $0 degree $1°', [
	['#04FBD1', 10, ['#0acdcd', '#04FBD1', '#04FB91']],
	['#04FBD1', 80, ['#2a0acd', '#04FBD1', '#80fb04']]
]), function (assert, [from, degree, expected]) {
	assert.colorArrayCloseTo(
		ColorFactory.analogous(from, degree),
		expected
	);
});

QUnit.test('interpolate() does nothing if passed one color', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#e6e6e6', '#e6e6e6', 2),
		['#e6e6e6', '#e6e6e6']
	);
});

QUnit.test('interpolate() does nothing if passed two colors', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#e6e6e6', '#bbbbbb', 2),
		['#e6e6e6', '#bbbbbb']
	);
});

QUnit.test('interpolate() finds medium gray', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#000000', '#ffffff', 3),
		['#000000', '#999999', '#ffffff']
	);
});

QUnit.test('interpolate() finds many grays', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#000000', '#ffffff', 6),
		['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff']
	);
});

QUnit.test('interpolate() interpolates hues', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('red', 'blue', 3),
		['red', '#00ff00', 'blue']
	);
});

QUnit.test('interpolate() interpolates saturation', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#ff0000', '#996666', 3),
		['#ff0000', '#cc3333', '#996666']
	);
});

QUnit.test('interpolate() interpolates lightness', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.interpolate('#ff0000', '#ffffff', 5),
		['#ff0000', '#e75858', '#df9f9f', '#e7d7d7', '#ffffff']
	);
});

QUnit.test('qualitative() reproduces example', function (assert) {
	assert.colorIsDistinguishable(ColorFactory.qualitative('#80b696', 3));
});

QUnit.test('qualitative() returns 5 saturated colors when asked', function (assert) {
	assert.colorIsDistinguishable(ColorFactory.qualitative('red', 5));
});

QUnit.test('qualitative() is able to start from white', function (assert) {
	assert.colorIsDistinguishable(ColorFactory.qualitative('white', 5));
});

QUnit.test('qualitative() is able to start from black', function (assert) {
	assert.colorIsDistinguishable(ColorFactory.qualitative('black', 4));
});

QUnit.test('qualitative() is to start with no color', function (assert) {
	assert.colorIsDistinguishable(ColorFactory.qualitative(6));
});

QUnit.test('qualitative() returns 9 colors when asked', function (assert) {
	var colors = ColorFactory.qualitative(ColorHelper.lighten(ColorHelper.saturate('red', -20), 20), 9);
	assert.strictEqual(colors.length, 9, 'validate array size');
	assert.colorIsDistinguishable(colors);
});

QUnit.test('sequential() reproduces example gray', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.sequential('#e6e6e6', 4),
		['#e6e6e6', '#b3b3b3', '#5d5d5d', '#202020']
	);
});

QUnit.test('sequential() reproduces example purple', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.sequential('#c4b3d8', '#240d5e', 3),
		['#c4b3d8', '#7c67ab', '#240d5e'],
		25 // custom threshold
	);
});

QUnit.test('sequential() works from dark purple lighter', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.sequential('#240d5e', 7),
		['#240d5e', '#34138a', '#4519b5', '#561fe0', '#764ae6', '#9775ec', '#b8a1f2']
	);
});

QUnit.test('sequential() works from light purple darker', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.sequential('#c4b3d8', 7),
		['#c3b2d7', '#ac93c8', '#9475b8', '#7d57a8', '#66478a', '#50376c', '#39284d']
	);
});

QUnit.test('sequential() reproduces example orange', function (assert) {
	assert.colorArrayCloseTo(
		ColorFactory.sequential('#ffcc80', '#b30000', 3),
		['#ffcc80', '#f35926', '#b30000']
	);
});

QUnit.test.each('binary()', {
	'reproduces example gray': ['#a6a6a6', '#e6e6e6'],
	'reproduces example green': ['#80b696', '#cce8d7'],
	'reproduces example pink': ['#de68a6', '#fbb4d9', 15]
}, function (assert, [input, expected, threshold]) {
	assert.colorArrayCloseTo(
		ColorFactory.binary(input),
		[input, expected],
		threshold
	);
});

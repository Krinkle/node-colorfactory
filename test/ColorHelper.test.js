QUnit.module('ColorHelper', {
	beforeEach: function () {
		// Off by default, used in the test suite for convinience
		ColorHelper.clobberPrototype();
	},
	afterEach: function () {
		ColorHelper.restorePrototype();
	}
});

QUnit.test('strToHexColor()', function (assert) {
	assert.equal(
		'#123456'.toHexColor(), '#123456',
		'do nothing if passed hex'
	);
	assert.equal(
		'#369'.toHexColor(), '#336699',
		'convert websafe color to hex'
	);
	assert.equal(
		'black'.toHexColor(), '#000000',
		'convert black to hex'
	);
	assert.equal(
		'white'.toHexColor(), '#ffffff',
		'convert white to hex'
	);
	assert.equal(
		'olive'.toHexColor(), '#808000',
		'convert olive to hex'
	);
});

QUnit.test('hexToRGB()', function (assert) {
	var sample = '#123456';

	assert.deepEqual(
		sample.toRGB(), [18, 52, 86],
		'set red, green, blue'
	);
});

QUnit.test('rgbToHSL()', function (assert) {
	assert.deepEqual('#ffffff'.toHSL(), [0, 0, 100], 'convert white to hsl');

	assert.deepEqual('#000000'.toHSL(), [0, 0, 0], 'convert black to hsl');

	assert.deepEqual('#ff0000'.toHSL(), [0, 100, 50], 'convert red to hsl');

	assert.deepEqual('#00ff00'.toHSL(), [120, 100, 50], 'convert green to hsl');

	assert.deepEqual('#0000ff'.toHSL(), [240, 100, 50], 'convert blue to hsl');

	assert.deepEqual('#800'.toHSL(), [0, 100, 27], 'convert #800 to hsl');

	assert.deepEqual('#336699'.toHSL(), [210, 50, 40], 'convert #336699 to hsl');
});

QUnit.test('hslToHexColor()', function (assert) {
	var cases = {
		'convert blue': {
			hsl: [240, 100, 50],
			hex: '#0000ff'
		},
		'convert red': {
			hsl: [0, 100, 25],
			hex: '#800000'
		},
		'convert white': {
			hsl: [0, 0, 100],
			hex: '#ffffff'
		},
		'convert blank': {
			hsl: [0, 0, 0],
			hex: '#000000'
		}
	};
	for (var message in cases) {
		var pars = cases[message];
		// hslToHexColor(hls=[0, 0, 0])
		assert.equal(ColorHelper.hslToHexColor(pars.hsl), pars.hex, message + ' (array argument)');
		// hslToHexColor(h=0, s=0, l=0)
		assert.equal(ColorHelper.hslToHexColor.apply(null, pars.hsl), pars.hex, message + ' (3 arguments)');
	}
});

QUnit.test('lighten()', function (assert) {
	assert.match('#800'.lighten(0), /#8[89a]0000/, 'do nothing with zero');
	assert.equal('#800'.lighten(100), '#ffffff', 'set to white with 100');
	assert.equal('#fff'.lighten(20), '#ffffff', 'do nothing if already white');
	assert.equal('#880000'.lighten(20), '#f00000', 'lighten 20%');
});

QUnit.test('darken()', function (assert) {
	assert.match('#800'.darken(0), /#8[89a]0000/, 'do nothing with zero');
	assert.equal('#800'.darken(100), '#000000', 'set to black with 100');
	assert.equal('#000'.darken(20), '#000000', 'do nothing if already black');
	assert.match('#880000'.darken(20), /#2[234]0000/, 'darken 20%');
});

QUnit.test('saturate()', function (assert) {
	assert.match('#800'.saturate(0), /#8[789a]0000/, 'do nothing with zero');

	assert.equal(
		ColorHelper.hslToHexColor(120, 30, 90).saturate(20),
		'#d9f2d9',
		'saturate(hsl(120, 30%, 90%), 20%)'
	);

	assert.match('#855'.saturate(20), /#9[de]3f3f/, 'saturate(#855, 20%) => #9e3f3f');

	assert.match('#000'.saturate(20), /#000000/, 'saturate(#000, 20%) => #000');

	assert.match('#fff'.saturate(20), /#ffffff/, 'saturate(#fff, 20%) => #ffffff');

	assert.match('#8a8'.saturate(100), /#33ff33/, 'saturate(#8a8,100%) => #33ff33');

	assert.match('#8a8'.saturate(0), /#88aa88/, 'saturate(#8a8, 0%) => #88aa88');

	assert.equal(
		ColorHelper.hslToHexColor(120, 30, 90).saturate(-20),
		'#e3e8e3',
		'desaturate(hsl(120, 30%, 90%), 20%) => hsl(120, 10%, 90%)'
	);

	assert.match('#855'.saturate(-20), /#716a6a/, 'desaturate 855 to #726b6b');
	assert.match('#000'.saturate(-20), /#000000/, 'desaturate 000 to black');
	assert.match('#fff'.saturate(-20), /#ffffff/, 'desaturate 000 to white');
	assert.match('#8a8'.saturate(-100), /#999999/, 'desaturate 000 to white');
	assert.match('#855'.saturate(-20), /#716a6a/, 'desaturate(#855, 20%) => #726b6b');
});

/* Utilities */

function renderColors(colors, target, label) {
	target = target || 'body';
	$(document).ready(function () {
		var i,
			$swatches = $('<div>').addClass('test-colorFactory-swatches');

		for (i = 0; i < colors.length; i += 1) {
			$('<div class="test-colorFactory-swatch"></div>')
				.css('backgroundColor', colors[colors.length - i - 1])
				.appendTo($swatches);
		}

		$('<div class="test-colorFactor-holder"></div>').append(
			$swatches,
			$('<div>').text(label).addClass('test-colorFactory-label')
		).appendTo(target);
	});
}

/* Custom tests */

QUnit.colorTest = function (title, actualColors, callback) {
	QUnit.test(title, function () {
		this.renderColors = function (colors, label) {
			renderColors(colors, '#qunit-test-output-' + QUnit.config.current.testId, label);
		};
		this.renderColors(actualColors, 'actual');

		this.colors = actualColors;

		callback.apply(this, arguments);
	});
};

QUnit.colorTest.closeMatch = function (title, actualColors, expectedColors, threshold) {
	QUnit.colorTest(title, actualColors, function (assert) {
		this.renderColors(expectedColors, 'match');

		assert.strictEqual(actualColors.length, expectedColors.length, 'validate array size');
		for (var i = 0, len = expectedColors.length; i < len; i += 1) {
			assert.colorIsVisuallyClose(actualColors[i], expectedColors[i], threshold);
		}
	});
};

QUnit.colorTest.complementary = function (input, expected) {
	QUnit.colorTest.closeMatch('complementaryColors() for ' + input,
		ColorFactory.complementary(input),
		[expected, input]
	);
};

// The test for binary() is basically the same as for complementary(),
// both take one value and add one to it. Except that
// complementary() sets the input last, and binary() sets it first.
QUnit.colorTest.binary = function (message, input, expected, threshold) {
	QUnit.colorTest.closeMatch(message,
		ColorFactory.binary(input),
		[input, expected],
		threshold
	);
};

QUnit.colorTest.distinguishable = function (title, colors, callback) {
	QUnit.colorTest(title, colors, function (assert) {
		assert.colorIsDistinguishable(colors);
		if (callback) {
			callback.apply(this, arguments);
		}
	});
};

/* Custom assertions */

QUnit.assert.match = function (actual, regex, message) {
	QUnit.push(
		regex.test(actual),
		actual,
		regex,
		message
	);
};

QUnit.assert.colorIsDistinguishable = function (colors) {
	var i, c0, c1, hsl0, hsl1, diff;

	if (colors.length < 2) {
		QUnit.pushFailure('assert.beDistinguishable expects two or more colors.');
		return;
	}

	for (i = 0; i < (colors.length - 1); i++) {
		c0 = colors[i];
		c1 = colors[i + 1];
		hsl0 = ColorHelper.rgbToHSL(c0);
		hsl1 = ColorHelper.rgbToHSL(c1);

		diff = Math.abs(hsl0[0] - hsl1[0]) + Math.abs(hsl0[1] - hsl1[1]) + Math.abs(hsl0[2] - hsl1[2]);
		QUnit.push(
			diff > 30,
			diff,
			'> 30',
			'color #' + i + ' ' + c0 +
				' (' + hsl0.join(',') + ') is distinguishable from ' +
				'color #' + (i + 1) + ' ' + c1 + ' (' + hsl1.join(',') + ') ' +
				'in saturation and lightness'
		);
	}
};

QUnit.assert.colorIsVisuallyClose = function (actual, expected, threshold) {
	threshold = threshold || 8;

	var d,
		expectedHsl = ColorHelper.rgbToHSL(expected),
		actualHsl = ColorHelper.rgbToHSL(actual),
		diffTotal = 0,
		diff = [];
	for (d in actualHsl) {
		diff.push(Math.abs(expectedHsl[d] - actualHsl[d]));
	}

	for (d in diff) {
		diffTotal += diff[d];
		if (d === 0) {
			diffTotal /= 3.6;
		}
	}

	QUnit.push(
		diffTotal < (threshold * 3),
		diffTotal + ' (differed HSV: [' + diff.join(',') + '])',
		diffTotal + ' < (threshold * 3)',
		'color ' + actual + ' is visually close to ' + expected + ' (within a threshold of: ' + threshold + ')'
	);
};

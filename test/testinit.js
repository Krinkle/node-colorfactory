/* Utilities */

var domReady = new Promise(function (resolve) {
	if (/complete/.test(document.readyState)) resolve();
	else document.addEventListener('readystatechange', function () {
		if (/complete/.test(document.readyState)) resolve();
	});
});

function element(tagName, props) {
	return Object.assign(document.createElement(tagName), props || {});
}

function renderColors(colors, target, label) {
	domReady.then(function () {
		var i, holder,
			swatches = element('div', { className: 'test-colorFactory-swatches' });

		for (i = 0; i < colors.length; i++) {
			swatches.append(
				element('div', {
					className: 'test-colorFactory-swatch',
					style: 'background-color:' + colors[colors.length - i - 1]
				})
			);
		}

		holder = element('div', { className: 'test-colorFactor-holder' });
		holder.append(
			swatches,
			element('div', { textContent: label, className: 'test-colorFactory-label' })
		);
		document.querySelector(target).append(holder);
	});
}

/* Custom tests */

QUnit.colorTest = function (title, actualColors, callback) {
	return QUnit.test(title, function () {
		this.renderColors = function (colors, label) {
			renderColors(colors, '#qunit-test-output-' + QUnit.config.current.testId, label);
		};
		this.renderColors(actualColors, 'actual');

		this.colors = actualColors;

		return callback.apply(this, arguments);
	});
};

QUnit.colorTest.closeMatch = function (title, actualColors, expectedColors, threshold) {
	return QUnit.colorTest(title, actualColors, function (assert) {
		this.renderColors(expectedColors, 'match');

		assert.strictEqual(actualColors.length, expectedColors.length, 'validate array size');
		for (var i = 0, len = expectedColors.length; i < len; i += 1) {
			assert.colorIsVisuallyClose(actualColors[i], expectedColors[i], threshold);
		}
	});
};

QUnit.colorTest.complementary = function (input, expected) {
	return QUnit.colorTest.closeMatch('complementaryColors() for ' + input,
		ColorFactory.complementary(input),
		[expected, input]
	);
};

// The test for binary() is basically the same as for complementary(),
// both take one value and add one to it. Except that
// complementary() sets the input last, and binary() sets it first.
QUnit.colorTest.binary = function (message, input, expected, threshold) {
	return QUnit.colorTest.closeMatch(message,
		ColorFactory.binary(input),
		[input, expected],
		threshold
	);
};

QUnit.colorTest.distinguishable = function (title, colors, callback) {
	return QUnit.colorTest(title, colors, function (assert) {
		assert.colorIsDistinguishable(colors);
		if (callback) {
			callback.apply(this, arguments);
		}
	});
};

/* Custom assertions */

QUnit.assert.match = function (actual, regex, message) {
	this.pushResult( {
		result: regex.test(actual),
		actual: actual,
		expected: regex,
		message: message
	} );
};

QUnit.assert.colorIsDistinguishable = function (colors) {
	var i, c0, c1, hsl0, hsl1, diff;

	if (colors.length < 2) {
		this.pushFailure('assert.beDistinguishable expects two or more colors.');
		return;
	}

	for (i = 0; i < (colors.length - 1); i++) {
		c0 = colors[i];
		c1 = colors[i + 1];
		hsl0 = ColorHelper.rgbToHSL(c0);
		hsl1 = ColorHelper.rgbToHSL(c1);

		diff = Math.abs(hsl0[0] - hsl1[0]) + Math.abs(hsl0[1] - hsl1[1]) + Math.abs(hsl0[2] - hsl1[2]);
		this.pushResult( {
			result: diff > 30,
			actual: diff,
			expected: '> 30',
			message: 'color #' + i + ' ' + c0 +
				' (' + hsl0.join(',') + ') is distinguishable from ' +
				'color #' + (i + 1) + ' ' + c1 + ' (' + hsl1.join(',') + ') ' +
				'in saturation and lightness'
		} );
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

	this.pushResult( {
		result: diffTotal < (threshold * 3),
		actual: diffTotal + ' (differed HSV: [' + diff.join(',') + '])',
		expected: diffTotal + ' < (threshold * 3)',
		message: 'color ' + actual + ' is visually close to ' + expected + ' (within a threshold of: ' + threshold + ')'
	} );
};

/* eslint-env browser, qunit */
/* exported eachKeyed, eachFmt */

function element(tagName, props) {
	return Object.assign(document.createElement(tagName), props || {});
}

function eachKeyed(labelKey, dataset) {
	const result = {};
	for (let i = 0; i < dataset.length; i++) {
		result[ dataset[i][labelKey] ] = dataset[i];
	}
	return result;
}

function eachFmt(labelFmt, dataset) {
	const result = {};
	for (let i = 0; i < dataset.length; i++) {
		const label = labelFmt.replace(/\$(\d+)/g, ( str, num ) => dataset[i][num]);
		result[ label ] = dataset[i];
	}
	return result;
}

function renderColors(colors, label) {
	var target = '#qunit-test-output-' + QUnit.config.current.testId;
	var swatches = element('div', { className: 'test-colorFactory-swatches' });

	for (var i = 0; i < colors.length; i++) {
		swatches.append(
			element('div', {
				className: 'test-colorFactory-swatch',
				style: 'background-color:' + colors[colors.length - i - 1]
			})
		);
	}

	var holder = element('div', { className: 'test-colorFactor-holder' });
	holder.append(
		swatches,
		element('div', { textContent: label, className: 'test-colorFactory-label' })
	);
	document.querySelector(target).append(holder);
}

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
	if (colors.length < 2) {
		this.pushFailure('assert.beDistinguishable expects two or more colors.');
		return;
	}

	renderColors(colors, 'actual');

	for (let i = 0; i < (colors.length - 1); i++) {
		let c0 = colors[i];
		let c1 = colors[i + 1];
		let hsl0 = ColorHelper.rgbToHSL(c0);
		let hsl1 = ColorHelper.rgbToHSL(c1);

		let diff = Math.abs(hsl0[0] - hsl1[0]) + Math.abs(hsl0[1] - hsl1[1]) + Math.abs(hsl0[2] - hsl1[2]);
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

QUnit.assert.colorCloseTo = function (actual, expected, threshold) {
	threshold = threshold || 8;

	var expectedHsl = ColorHelper.rgbToHSL(expected);
	var actualHsl = ColorHelper.rgbToHSL(actual);

	var diff = [];
	for (let d in actualHsl) {
		diff.push(Math.abs(expectedHsl[d] - actualHsl[d]));
	}

	var diffTotal = 0;
	for (let d in diff) {
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

QUnit.assert.colorArrayCloseTo = function (actualColors, expectedColors, threshold) {
	renderColors(actualColors, 'actual');
	renderColors(expectedColors, 'expected');
	this.strictEqual(actualColors.length, expectedColors.length, 'validate array size');

	for (var i = 0; i < actualColors.length; i++) {
		this.colorCloseTo(actualColors[i], expectedColors[i], threshold);
	}
};

/*!
 * ColorFactory
 *
 * Copyright (c) 2010-2012 Andrew J. Peterson / NDP Software.
 * All Rights Reserved.
 */
(function () {

	var ColorHelper, ColorFactory,
		sixHexDigits = 0xffffff;

	ColorFactory = {
		primaryColors: function () {
			return ['#ff0', '#ff0000', '#0000ff'];
		},

		primaryAndSecondaryColors: function () {
			return ['#ff0', '#f90', '#f00', '#90f', '#00f', '#0f6'];
		},

		complementary: function (color) {
			var hsl = ColorHelper.rgbToHSL(color);
			hsl[0] = (hsl[0] + 180) % 360;
			return [ColorHelper.hslToHexColor(hsl), color];
		},

		/**
		 * Two adjacent colors on 12-part color wheel
		 */
		analogous: function (color, angle) {
			var hsl, color0, color2;
			if (!angle) {
				angle = 30;
			}
			hsl = ColorHelper.rgbToHSL(color);
			hsl[0] = (hsl[0] + angle) % 360;
			color0 = ColorHelper.hslToHexColor(hsl);
			color0 = ColorHelper.darken(color0, 8);
			color0 = ColorHelper.saturate(color0, -6);
			hsl = ColorHelper.rgbToHSL(color);
			hsl[0] = (hsl[0] - angle + 360) % 360;
			color2 = ColorHelper.hslToHexColor(hsl);
			return [color0, color, color2];
		},

		random: function () {
			// even distribution within (0,0xffffff)
			var c = Math.round((Math.random() + sixHexDigits) + (sixHexDigits + 1)).toString(16);
			c = c.substr(c.length - 6, 6);
			return '#' + c;
		},

		randomGray: function () {
			return ColorFactory.random().saturate(-100);
		},

		randomHue: function (s, l) {
			var h = Math.round(Math.random() * 256);
			return ColorHelper.hslToHexColor(h, s, l);
		},

		interpolate: function (color1, colorN, steps) {
			var d, i,
				hsl = ColorHelper.rgbToHSL(color1),
				hslN = ColorHelper.rgbToHSL(colorN),
				delta = [],
				colors = [];

			for (d in hsl) {
				delta.push((hslN[d] - hsl[d]) / (steps - 1));
			}

			for (i = 0; i < steps; i++) {
				colors.push(ColorHelper.hslToHexColor(hsl));
				for (d in hsl) {
					hsl[d] += delta[d];
				}
			}
			return colors;
		},

		// http://www.personal.psu.edu/cab38/ColorSch/Schemes.html
		/**
		 * Qualitative schemes do not imply magnitude differences between legend classes,
		 * and hues are used to create the primary visual differences between classes.
		 * Qualitative schemes are best suited to representing nominal or categorical data.
		 * @param refColor (optional)
		 * @param count
		 */
		qualitative: function (refColor, count) {
			if (count === undefined && typeof refColor === 'number') {
				count = refColor;
				refColor = 'black';
			}
			var i,
				hsl = ColorHelper.rgbToHSL(refColor),
				colors = [];

			hsl[1] = Math.max(60, hsl[1]);
			hsl[2] = Math.max(40, hsl[2]);
			hsl[2] = Math.min(70, hsl[2]);

			for (i = 0; i < count; i++) {
				colors.push(ColorHelper.hslToHexColor(hsl));
				hsl[0] += (360 / count);
				hsl[0] %= 360;
			}
			return colors;
		},

		/**
		 * Sequential schemes are suited to ordered data that progress from low to high.
		 * Lightness steps dominate the look of these schemes, with light colors
		 * for low data values to dark colors for high data values.
		 * @param startColor
		 * @param endColor (optional)
		 * @param count
		 */
		sequential: function (startColor, endColor, count) {
			var lightness,
				hsl = ColorHelper.rgbToHSL(startColor);
			if (count === undefined) {
				count = endColor;
				lightness = hsl[2] - 20 * count;
				if (lightness < 0) {
					lightness = 100 - hsl[2];
				}
				endColor = ColorHelper.hslToHexColor([hsl[0], hsl[1], lightness]);
			}
			return ColorFactory.interpolate(startColor, endColor, count);

		},

		binary: function (trueColor) {
			return [trueColor, ColorHelper.lighten(ColorHelper.saturate(trueColor, 10), 25)];
		},

		/**
		 * Diverging schemes put equal emphasis on mid-range critical values and
		 * extremes at both ends of the data range.
		 * The critical class or break in the middle of the legend is
		 * emphasized with light colors and low and high extremes are
		 * emphasized with dark colors that have contrasting hues.
		 * @param startColor
		 * @param count
		 */
		diverging: function () {
			/* @todo */
		}
	};

	// Expose: Server or browser
	if (typeof module !== 'undefined' && module.exports) {
		ColorHelper = require('./ColorHelper');
		module.exports = ColorFactory;
	} else {
		ColorHelper = this.ColorHelper;
		this.ColorFactory = ColorFactory;
	}
}());

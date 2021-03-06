/*!
 * ColorHelper
 */
(function () {

	/* Local variables */

	var ColorHelper,
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty,
		slice = Array.prototype.slice,
		/**
		 * Use a singleton cache of all color strings we see.
		 * Each key points to a structure, which can have hex, rgb, etc. values in it.
		 */
		immutableCache = {},
		colorsHTML4 = {
			black: '#000000',
			silver: '#c0c0c0',
			gray: '#808080',
			white: '#ffffff',
			maroon: '#800000',
			red: '#ff0000',
			purple: '#800080',
			fuchsia: '#ff00ff',
			green: '#008000',
			lime: '#00ff00',
			olive: '#808000',
			yellow: '#ffff00',
			navy: '#000080',
			blue: '#0000ff',
			teal: '#008080',
			aqua: '#00ffff'
		},
		colorsHTML5 = {
			AliceBlue: '#F0F8FF',
			AntiqueWhite: '#FAEBD7',
			Aqua: '#00FFFF',
			Aquamarine: '#7FFFD4',
			Azure: '#F0FFFF',
			Beige: '#F5F5DC',
			Bisque: '#FFE4C4',
			Black: '#000000',
			BlanchedAlmond: '#FFEBCD',
			Blue: '#0000FF',
			BlueViolet: '#8A2BE2',
			Brown: '#A52A2A',
			BurlyWood: '#DEB887',
			CadetBlue: '#5F9EA0',
			Chartreuse: '#7FFF00',
			Chocolate: '#D2691E',
			Coral: '#FF7F50',
			CornflowerBlue: '#6495ED',
			Cornsilk: '#FFF8DC',
			Crimson: '#DC143C',
			Cyan: '#00FFFF',
			DarkBlue: '#00008B',
			DarkCyan: '#008B8B',
			DarkGoldenRod: '#B8860B',
			DarkGray: '#A9A9A9',
			DarkGrey: '#A9A9A9',
			DarkGreen: '#006400',
			DarkKhaki: '#BDB76B',
			DarkMagenta: '#8B008B',
			DarkOliveGreen: '#556B2F',
			Darkorange: '#FF8C00',
			DarkOrchid: '#9932CC',
			DarkRed: '#8B0000',
			DarkSalmon: '#E9967A',
			DarkSeaGreen: '#8FBC8F',
			DarkSlateBlue: '#483D8B',
			DarkSlateGray: '#2F4F4F',
			DarkSlateGrey: '#2F4F4F',
			DarkTurquoise: '#00CED1',
			DarkViolet: '#9400D3',
			DeepPink: '#FF1493',
			DeepSkyBlue: '#00BFFF',
			DimGray: '#696969',
			DimGrey: '#696969',
			DodgerBlue: '#1E90FF',
			FireBrick: '#B22222',
			FloralWhite: '#FFFAF0',
			ForestGreen: '#228B22',
			Fuchsia: '#FF00FF',
			Gainsboro: '#DCDCDC',
			GhostWhite: '#F8F8FF',
			Gold: '#FFD700',
			GoldenRod: '#DAA520',
			Gray: '#808080',
			Grey: '#808080',
			Green: '#008000',
			GreenYellow: '#ADFF2F',
			HoneyDew: '#F0FFF0',
			HotPink: '#FF69B4',
			IndianRed: '#CD5C5C',
			Indigo: '#4B0082',
			Ivory: '#FFFFF0',
			Khaki: '#F0E68C',
			Lavender: '#E6E6FA',
			LavenderBlush: '#FFF0F5',
			LawnGreen: '#7CFC00',
			LemonChiffon: '#FFFACD',
			LightBlue: '#ADD8E6',
			LightCoral: '#F08080',
			LightCyan: '#E0FFFF',
			LightGoldenRodYellow: '#FAFAD2',
			LightGray: '#D3D3D3',
			LightGrey: '#D3D3D3',
			LightGreen: '#90EE90',
			LightPink: '#FFB6C1',
			LightSalmon: '#FFA07A',
			LightSeaGreen: '#20B2AA',
			LightSkyBlue: '#87CEFA',
			LightSlateGray: '#778899',
			LightSlateGrey: '#778899',
			LightSteelBlue: '#B0C4DE',
			LightYellow: '#FFFFE0',
			Lime: '#00FF00',
			LimeGreen: '#32CD32',
			Linen: '#FAF0E6',
			Magenta: '#FF00FF',
			Maroon: '#800000',
			MediumAquaMarine: '#66CDAA',
			MediumBlue: '#0000CD',
			MediumOrchid: '#BA55D3',
			MediumPurple: '#9370D8',
			MediumSeaGreen: '#3CB371',
			MediumSlateBlue: '#7B68EE',
			MediumSpringGreen: '#00FA9A',
			MediumTurquoise: '#48D1CC',
			MediumVioletRed: '#C71585',
			MidnightBlue: '#191970',
			MintCream: '#F5FFFA',
			MistyRose: '#FFE4E1',
			Moccasin: '#FFE4B5',
			NavajoWhite: '#FFDEAD',
			Navy: '#000080',
			OldLace: '#FDF5E6',
			Olive: '#808000',
			OliveDrab: '#6B8E23',
			Orange: '#FFA500',
			OrangeRed: '#FF4500',
			Orchid: '#DA70D6',
			PaleGoldenRod: '#EEE8AA',
			PaleGreen: '#98FB98',
			PaleTurquoise: '#AFEEEE',
			PaleVioletRed: '#D87093',
			PapayaWhip: '#FFEFD5',
			PeachPuff: '#FFDAB9',
			Peru: '#CD853F',
			Pink: '#FFC0CB',
			Plum: '#DDA0DD',
			PowderBlue: '#B0E0E6',
			Purple: '#800080',
			Red: '#FF0000',
			RosyBrown: '#BC8F8F',
			RoyalBlue: '#4169E1',
			SaddleBrown: '#8B4513',
			Salmon: '#FA8072',
			SandyBrown: '#F4A460',
			SeaGreen: '#2E8B57',
			SeaShell: '#FFF5EE',
			Sienna: '#A0522D',
			Silver: '#C0C0C0',
			SkyBlue: '#87CEEB',
			SlateBlue: '#6A5ACD',
			SlateGray: '#708090',
			SlateGrey: '#708090',
			Snow: '#FFFAFA',
			SpringGreen: '#00FF7F',
			SteelBlue: '#4682B4',
			Tan: '#D2B48C',
			Teal: '#008080',
			Thistle: '#D8BFD8',
			Tomato: '#FF6347',
			Turquoise: '#40E0D0',
			Violet: '#EE82EE',
			Wheat: '#F5DEB3',
			White: '#FFFFFF',
			WhiteSmoke: '#F5F5F5',
			Yellow: '#FFFF00',
			YellowGreen: '#9ACD32'
		},
		// Map String.prototype methods to ColorHelper
		strProtoMapping = {
			toHexColor: 'strToHexColor',
			toRGB: 'hexToRGB',
			lighten: 'lighten',
			saturate: 'saturate',
			darken: 'darken',
			toHSL: 'rgbToHSL'
		},
		// Keep track of which methods we added to String.prototype,
		// so we can safely remove only the ones we added.
		strProtoPollution = [];

	/* Local functions */

	function isArray(object) {
		return typeof object === 'object' && toString.call(object) === '[object Array]';
	}

	/**
	 * Can't be used inline in the for-loop, because of variable scope.
	 * Otherwise all methods would be pointing to the method as put in
	 * the variable that lives on until after the loop itself.
	 */
	function makeStrProtoFn(method) {
		return function () {
			// Convert `arguments` into an array (usually empty or has 1 parameter)
			var args = slice.call(arguments, 0);
			// Add the current string as the first argument
			args.unshift(this);
			return ColorHelper[method].apply(ColorHelper, args);
		};
	}

	/**
	 * Returns (or creates) the cached color structure
	 */
	function colorCache(c) {
		if (!immutableCache[c]) {
			immutableCache[c] = {};
		}
		return immutableCache[c];
	}

	/* HSL helpers */

	/** @return Array */
	function hsl2rgb(h, s, l) {
		// HSL 0 to 1 => RGB results from 0 to 255
		var r, g, b, var_1, var_2;

		if (s === 0) {
			r = l * 255;
			g = l * 255;
			b = l * 255;
		} else {
			var_2 = (l < 0.5) ? l * (1 + s) : ((l + s) - (s * l));
			var_1 = 2 * l - var_2;

			r = 255 * h2rgb(var_1, var_2, h + (1 / 3));
			g = 255 * h2rgb(var_1, var_2, h);
			b = 255 * h2rgb(var_1, var_2, h - (1 / 3));
		}

		return [r, g, b];
	}

	function h2rgb(v1, v2, vH) {
		if (vH < 0) {
			vH += 1;
		}

		if (vH > 1) {
			vH -= 1;
		}

		if ((6 * vH) < 1) {
			return (v1 + (v2 - v1) * 6 * vH);
		}

		if ((2 * vH) < 1) {
			return v2;
		}

		if ((3 * vH) < 2) {
			return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
		}

		return v1;
	}

	function hex2(n) {
		var h = Math.round(n).toString(16);
		if (h.length === 1) {
			h = '0' + h;
		}
		return h.substr(0, 1) + h.substr(1, 1);
	}

	/**
	 * @param Number h
	 * @param Number s
	 * @param Number l
	 * - or -
	 * @param Array hsl
	 */
	function hslToHexColor(hsl, s, l) {
		var h, rgb;
		if (isArray(hsl)) {
			h = hsl[0] || 0;
			s = hsl[1] || 0;
			l = hsl[2] || 0;
		} else {
			h = hsl;
		}

		// HSL from 0 to 1
		h = ((h + 360) % 360.0) / 360;
		s = s / 100.0;
		l = l / 100.0;

		rgb = hsl2rgb(h, s, l);
		return '#' + hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
	}

	/* RGB helpers */

	/**
	 * [0..360, 0..100, 0.100]
	 * http://www.easyrgb.com/index.php?X=MATH&H=18#text18
	 */
	function rgbToHsl(rgb) {
		var r, g, b, max, min, d, h, s, l,
			cache,
			del_R, del_G, del_B;

		rgb = ColorHelper.hexToRGB(rgb);
		r = rgb[0] / 255;
		g = rgb[1] / 255;
		b = rgb[2] / 255;
		max = Math.max(r, g, b);
		min = Math.min(r, g, b);

		// Delta RGB value
		d = max - min;
		l = (max + min) / 2;

		// gray?, no chroma...
		if (d === 0) {
			// HSl results from 0 to 1
			h = 0;
			s = 0;
		} else {
			// Chromatic data...
			s = d / (l < 0.5 ? (max + min) : (2 - max - min));

			del_R = (((max - r) / 6) + (d / 2)) / d;
			del_G = (((max - g) / 6) + (d / 2)) / d;
			del_B = (((max - b) / 6) + (d / 2)) / d;

			if (r === max) {
				h = del_B - del_G;
			} else if (g === max) {
				h = (1 / 3) + del_R - del_B;
			} else if (b === max) {
				h = (2 / 3) + del_G - del_R;
			}

			if (h < 0) {
				h += 1;
			}
			if (h > 0) {
				h -= 1;
			}
		}

		h = Math.round(h * 360);
		if (h < 0) {
			h += 360;
		}

		cache = colorCache(this);
		cache.hsl = [h, Math.round(s * 100), Math.round(l * 100)];
		return cache.hsl;
	}

	/* Public API */

	ColorHelper = {
		hslToHexColor: hslToHexColor,

		rgbToHSL: function (s) {
			var rgb = ColorHelper.strToHexColor(s);
			return rgbToHsl(rgb);
		},

		strToHexColor: function (str) {
			if (str.substr(0, 1) === '#' && str.length === 7) {
				colorCache(str).hex = '' + str;
			} else if (str.substr(0, 1) === '#' && str.length === 4) {
				colorCache(str).hex = '#' + str.substr(1, 1) + str.substr(1, 1) +
						str.substr(2, 1) + str.substr(2, 1) +
						str.substr(3, 1) + str.substr(3, 1);
			} else {
				colorCache(str).hex = colorsHTML4[str] || colorsHTML5[str];
			}
			return colorCache(str).hex;
		},

		hexToRGB: function (hexStr) {
			var h,
				cache = colorCache(hexStr);
			if (cache.rgb) {
				return cache.rgb;
			}
			h = ColorHelper.strToHexColor(hexStr);
			if (!h) {
				throw 'Unknown color "' + hexStr + '"';
			}
			cache.rgb = [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
			return cache.rgb;
		},

		lighten: function (color, percent) {
			var hsl = ColorHelper.rgbToHSL(color),
				newHSL = [hsl[0], hsl[1], Math.min(100, hsl[2] + percent)];
			return ColorHelper.hslToHexColor(newHSL);
		},

		darken: function (color, percent) {
			var hsl = ColorHelper.rgbToHSL(color),
				newHSL = [hsl[0], hsl[1], Math.max(0, hsl[2] - percent)];
			return ColorHelper.hslToHexColor(newHSL);
		},

		/**
		 * Increase or decrease the saturation of a color.
		 * @param percent positive values increase saturation, negative values desaturate.
		 */
		saturate: function (color, percent) {
			var hsl = ColorHelper.rgbToHSL(color),
				newHSL = [hsl[0], Math.min(100, Math.max(0, hsl[1] + percent)), hsl[2]];
			return ColorHelper.hslToHexColor(newHSL);
		},

		clobberPrototype: function () {
			for (var key in strProtoMapping) {
				// Only inject the method if there isn't something there
				// already in its place.
				if (!hasOwn.call(String.prototype, key)) {
					strProtoPollution.push(key);
					String.prototype[key] = makeStrProtoFn(strProtoMapping[key]);
				}
			}
		},
		restorePrototype: function () {
			for (var i = 0, len = strProtoPollution.length; i < len; i += 1) {
				delete String.prototype[strProtoPollution[i]];
			}
			// Empty the array
			strProtoPollution.length = 0;
		}
	};

	// Expose: Server or browser
	/* eslint-disable no-undef */
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = ColorHelper;
		/* eslint-enable no-undef */
	} else {
		this.ColorHelper = ColorHelper;
	}
}());

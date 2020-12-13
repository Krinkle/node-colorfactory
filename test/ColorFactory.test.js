QUnit.module('ColorFactory');

QUnit.colorTest.closeMatch(
	'primaryColors()',
	ColorFactory.primaryColors(),
	['yellow', 'red', 'blue']
);

QUnit.colorTest.closeMatch('primaryAndSecondaryColors()',
	ColorFactory.primaryAndSecondaryColors(),
	['yellow', 'Orange', 'red', '#90f', 'blue', '#0f6']
);

QUnit.colorTest.complementary('#ff0000', '#00ffff');

QUnit.colorTest.complementary('#0338ff', '#ff9d04');

QUnit.colorTest.complementary('#9e01d6', '#3ad501');

[
	['#6d00ff', '#0000ff', '#0090ff'],
	['#ff7400', '#ff0000', '#cd0074'],
	['#9fee00', '#ffff00', '#ffd300'],
	['#19d408', '#96fe04', '#EAFF04'],
	['#FE0435', '#FC04C5', '#8B16FB'],
	['#FF7590', '#FD74DF', '#BF7EFD'],
	['#0a8ccd', '#04FBD1', '#04fb56']
].forEach(function (item) {
	QUnit.colorTest.closeMatch('analogous (from: ' + item[1] + ')',
		ColorFactory.analogous(item[1]),
		item
	);
});

QUnit.colorTest.closeMatch('analogous (from: #04FBD1, degree: 10°)',
	ColorFactory.analogous('#04FBD1', 10),
	['#0acdcd', '#04FBD1', '#04FB91']
);

QUnit.colorTest.closeMatch('analogous (from: #04FBD1, degree: 80°)',
	ColorFactory.analogous('#04FBD1', 80),
	['#2a0acd', '#04FBD1', '#80fb04']
);

QUnit.colorTest.closeMatch('interpolate() does nothing if passed one color',
	ColorFactory.interpolate('#e6e6e6', '#e6e6e6', 2),
	['#e6e6e6', '#e6e6e6']
);

QUnit.colorTest.closeMatch('interpolate() does nothing if passed two colors',
	ColorFactory.interpolate('#e6e6e6', '#bbbbbb', 2),
	['#e6e6e6', '#bbbbbb']
);

QUnit.colorTest.closeMatch('interpolate() finds medium gray',
	ColorFactory.interpolate('#000000', '#ffffff', 3),
	['#000000', '#999999', '#ffffff']
);

QUnit.colorTest.closeMatch('interpolate() finds many grays',
	ColorFactory.interpolate('#000000', '#ffffff', 6),
	['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff']
);

QUnit.colorTest.closeMatch('interpolate() interpolates hues',
	ColorFactory.interpolate('red', 'blue', 3),
	['red', '#00ff00', 'blue']
);

QUnit.colorTest.closeMatch('interpolate() interpolates saturation',
	ColorFactory.interpolate('#ff0000', '#996666', 3),
	['#ff0000', '#cc3333', '#996666']
);

QUnit.colorTest.closeMatch('interpolate() interpolates lightness',
	ColorFactory.interpolate('#ff0000', '#ffffff', 5),
	['#ff0000', '#e75858', '#df9f9f', '#e7d7d7', '#ffffff']
);

QUnit.colorTest.distinguishable('qualitative() reproduces example',
	ColorFactory.qualitative('#80b696', 3)
);

QUnit.colorTest.distinguishable('qualitative() returns 5 saturated colors when asked',
	ColorFactory.qualitative('red', 5)
);

QUnit.colorTest.distinguishable('qualitative() is able to start from white',
	ColorFactory.qualitative('white', 5)
);

QUnit.colorTest.distinguishable('qualitative() is able to start from black',
	ColorFactory.qualitative('black', 4)
);

QUnit.colorTest.distinguishable('qualitative() is to start with no color',
	ColorFactory.qualitative(6)
);

QUnit.colorTest.distinguishable('qualitative() returns 9 colors when asked',
	ColorFactory.qualitative(ColorHelper.lighten(ColorHelper.saturate('red', -20), 20), 9),
	function (assert) {
		assert.equal(this.colors.length, 9, 'validate array size');
	}
);

QUnit.colorTest.closeMatch('sequential() reproduces example gray',
	ColorFactory.sequential('#e6e6e6', 4),
	['#e6e6e6', '#b3b3b3', '#5d5d5d', '#202020']
);


QUnit.colorTest.closeMatch('sequential() reproduces example purple',
		ColorFactory.sequential('#c4b3d8', '#240d5e', 3),
		['#c4b3d8', '#7c67ab', '#240d5e'],
		25 // custom threshold
);

QUnit.colorTest.closeMatch('sequential() works from dark purple lighter',
	ColorFactory.sequential('#240d5e', 7),
	['#240d5e', '#34138a', '#4519b5', '#561fe0', '#764ae6', '#9775ec', '#b8a1f2']
);

QUnit.colorTest.closeMatch('sequential() works from light purple darker',
	ColorFactory.sequential('#c4b3d8', 7),
	['#c3b2d7', '#ac93c8', '#9475b8', '#7d57a8', '#66478a', '#50376c', '#39284d']
);

QUnit.colorTest.closeMatch('sequential() reproduces example orange',
	ColorFactory.sequential('#ffcc80', '#b30000', 3),
	['#ffcc80', '#f35926', '#b30000']
);


QUnit.colorTest.binary('binary() reproduces example gray', '#a6a6a6', '#e6e6e6');

QUnit.colorTest.binary('binary() reproduces example green', '#80b696', '#cce8d7');

QUnit.colorTest.binary('binary() reproduces example pink', '#de68a6', '#fbb4d9', 15);

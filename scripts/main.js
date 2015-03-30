// Configure the require.js module loader
require.config({
	shim: {
		underscore: {
			exports: '_'
		},

		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},

	baseUrl: "",

	paths: {
		"backbone": "scripts/vendor/backbone/backbone",
		"jquery": "scripts/vendor/jquery/dist/jquery.min",
		"underscore": "scripts/vendor/underscore/underscore-min",
		"text": "scripts/vendor/requirejs-text/text",
		"json": "scripts/vendor/json3/lib/json3.min.js",
		"moment": "scripts/vendor/moment/moment",
		"async": "scripts/vendor/async/lib/async",
		"enums": "scripts/models/enums"
	}
});

require([
	'scripts/App'
], function (App) {
	App.initialize();
});
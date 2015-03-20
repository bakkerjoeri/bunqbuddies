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
		"i18n": "scripts/vendor/i18next/i18next.amd.min",
		"text": "scripts/vendor/requirejs-text/text",
		"json": "scripts/vendor/json3/lib/json3.min.js"
	}
});

require([
], function () {
});
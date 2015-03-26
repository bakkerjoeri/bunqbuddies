define([
	'backbone'
], function (Backbone) {

	var Router = Backbone.Router.extend({

		routes: {
			"": 								"home",					// /
			"conversation/:id":	"conversation", // /conversation/3
			"new": 							"new" 					// /new
		}
	});

	return Router;
});
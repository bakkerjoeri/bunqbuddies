define([
	'backbone',
	'scripts/views/AppView',
	'scripts/modules/DataHandler',
	'scripts/modules/Router'
], function (Backbone, AppView, DataHandler, Router) {

	var App = _.extend({

		initialize: function () {
			window.App = this;
			
			this.Router = new Router();

			DataHandler.on('loggedIn', function () {
				new AppView({
					el: '#app'
				}).render();
			});

			DataHandler.initialize();
		}
	}, Backbone.Events);

	return App;
});
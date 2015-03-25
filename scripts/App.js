define([
	'backbone',
	'scripts/views/AppView',
	'scripts/modules/DataHandler'
], function (Backbone, AppView, DataHandler) {

	var App = _.extend({
		initialize: function () {
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
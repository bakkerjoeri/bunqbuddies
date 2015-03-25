define([
	'scripts/views/AppView',
	'scripts/modules/DataHandler'
], function (AppView, DataHandler) {

	var App = {
		initialize: function () {
			// login before rendering the app
			DataHandler.login(function () {
				
				new AppView({
					el: '#app'
				}).render();
			});
		}
	}

	return App;
});
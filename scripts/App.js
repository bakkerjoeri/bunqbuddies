define([
	'scripts/views/AppView',
	'scripts/modules/UserHandler'
], function (AppView, UserHandler) {

	var App = {
		initialize: function () {
			// login before rendering the app
			UserHandler.login(function () {
				
				new AppView({
					el: '#app'
				}).render();
			});
		}
	}

	return App;
});
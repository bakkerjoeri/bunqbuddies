define([
	'backbone',
	'scripts/models/AppState',
	'text!templates/home.html'
], function (Backbone, AppState, templateString) {

	var HomeView = Backbone.View.extend({

		events: {
			'click .button_menu': 'onClickMenu'
		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		close: function () {
			
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		onClickMenu: function (event) {
			AppState.toggleMenu(true);
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
			
		});

		callback(null, compiledTemplate);
	}

	return HomeView;

});
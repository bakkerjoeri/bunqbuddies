define([
	'backbone',
	'text!templates/menu.html',
	'scripts/models/UserState'
], function (Backbone, templateString, UserState) {

	var MenuView = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		}
	});

	function getCompiledTemplate (template, callback) {
		console.log(UserState.get('conversations'));
		
		var compiledTemplate = template({
			username: UserState.get('currentUser').get('name'),
			conversations: UserState.get('conversations')
		});

		callback(compiledTemplate);
	}

	return MenuView;
});
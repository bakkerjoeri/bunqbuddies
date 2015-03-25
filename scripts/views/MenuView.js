define([
	'backbone',
	'text!templates/menu.html',
	'scripts/modules/DataHandler',
	'scripts/views/ConversationListView'
], function (Backbone, templateString, DataHandler, ConversationListView) {

	var MenuView = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		}
	});

	function getCompiledTemplate (template, callback) {
		var compiledTemplate = template({
			username: DataHandler.currentUser.get('name')
		});

		callback(compiledTemplate);
	}

	function addSubviews () {
		addConversationListView();
	}

	function addConversationListView () {
		new ConversationListView({
			el: '.view_menu-body'
		}).render();
	}

	return MenuView;
});
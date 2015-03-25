define([
	'backbone',
	'scripts/modules/DataHandler',
	'scripts/modules/ErrorHandler',
	'text!templates/conversationList.html',
	'scripts/views/ConversationItemView'
], function (Backbone, DataHandler, ErrorHandler, templateString, ConversationItemView) {

	var ConversationListView = Backbone.View.extend({

		initialize: function () {
			this.template = _.template(templateString);
			this.subviews = new Array();
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate({}, this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
		});

		callback(compiledTemplate);
	}

	function addSubviews () {
		addConversationItems();
	}

	function addConversationItems () {
		DataHandler.getConversations(function (error, conversations) {
			if (!error) {
				conversations.each(function (conversation) {
					var view = new ConversationItemView({
						el: '.list_conversation',
						model: conversation
					});

					view.render();
				});
			} else {
				ErrorHandler.report(error);
			}
		});
	}

	return ConversationListView;
});
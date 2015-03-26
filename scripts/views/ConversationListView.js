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
			this.collection = DataHandler.conversations;

			this.listenTo(this.collection, 'add remove', onCollectionChanged, this);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate({}, this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews(that);

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		close: function () {
			this.stopListening();
			this.undelegateEvents();

			_.each(this.subviews, function (subview) {
				subview.close();
			});
		}
	});

	function onCollectionChanged () {
		this.close();
		this.render();
	}

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
		});

		callback(compiledTemplate);
	}

	function addSubviews (parent) {
		parent.subviews = new Array();
		addConversationItems(parent);
	}

	function addConversationItems (parent) {
		var that = parent;

		that.collection.each(function (conversation) {
			that.$el.find('.list_conversation').append('<div class="list-item conversation-item" id="conversation-' + conversation.get('id') + '"></div>');
			
			var view = new ConversationItemView({
				el: '#conversation-' + conversation.get("id"),
				model: conversation
			});

			view.render();
			that.subviews.push(view);
		});
	}

	return ConversationListView;
});
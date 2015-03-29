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
			this.subviews = new Array();
		},

		close: function () {
			this.stopListening();
			this.undelegateEvents();

			_.each(this.subviews, function (subview) {
				subview.close();
			});
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate({}, this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					that.addSubviews();

					that.listenTo(that.collection, 'add', that.onConversationAdded, that);
					that.listenTo(that.collection, 'remove', that.onConversationRemoved, that);

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		addSubviews: function () {
			this.addConversationItems(this.collection);
		},

		addConversationItems: function (conversations) {
			conversations.each(function (conversation) {
				this.addConversationItem(conversation);
			}, this);
		},

		addConversationItem: function (conversation) {
			this.$el.find('.list_conversation').append('<div class="list-item conversation-item" id="conversation-' + conversation.get('id') + '"></div>');
			
			var view = new ConversationItemView({
				el: '#conversation-' + conversation.get("id"),
				model: conversation
			});

			view.render();
			this.subviews.push(view);
		},

		onConversationAdded: function (conversation) {
			this.addConversationItem(conversation);
		},

		onConversationRemoved: function () {

		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
		});

		callback(compiledTemplate);
	}

	

	return ConversationListView;
});
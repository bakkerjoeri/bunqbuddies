define([
	'backbone',
	'moment',
	'text!templates/conversationItem.html',
	'scripts/models/Message'
], function (Backbone, moment, templateString, Message) {

	var ConversationListView = Backbone.View.extend({

		events: {
			'click': 'goToConversation'
		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					that.listenTo(that.model.get('messages'), 'add', onNewMessage, that);
					that.listenTo(that.model, 'change:numberOfUnreadMessages', onUnreadMessagesUpdated, that);

					if (_.isFunction(callback)) {
						return callback(null);
					}
				});
			});
		},

		close: function () {
			this.stopListening();
			this.undelegateEvents();
			this.$el.undelegate('click');
		},

		goToConversation: function () {
			App.Router.navigate("conversation/" + this.model.get('id'), true);
		}
	});

	function onNewMessage () {
		this.$el.find('.conversation-item-latest-message .message-preview').text(this.model.get('messages').first().get('message'));
		this.$el.find('.conversation-item-latest-message .message-timestamp').text(this.model.get('messages').first().get('timestamp').from(moment()));
	}

	function onUnreadMessagesUpdated () {
		this.$el.find('.badge-unread-messages').text(this.model.get('numberOfUnreadMessages'));
	}

	function getCompiledTemplate (model, template, callback) {
		var latestMessage;

		if (model.get('messages').length > 0) {
			latestMessage = model.get('messages').first()
		} else {
			latestMessage = new Message();
		}

		var compiledTemplate = template({
			latestMessage: new Message(),
			conversation: model.toJSON()
		});

		callback(compiledTemplate);
	}

	return ConversationListView;
});
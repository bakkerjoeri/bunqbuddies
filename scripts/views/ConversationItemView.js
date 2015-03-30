define([
	'backbone',
	'moment',
	'scripts/models/AppState',
	'text!templates/conversationItem.html',
	'scripts/models/Message'
], function (Backbone, moment, AppState, templateString, Message) {

	var ConversationListView = Backbone.View.extend({

		events: {
			'click': 'goToConversation'
		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		close: function () {
			this.$el.undelegate('click');
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					that.listenTo(that.model.get('messages'), 'newLatestMessage', onNewMessage, that);
					that.listenTo(that.model, 'change:numberOfUnreadMessages', onUnreadMessagesUpdated, that);

					if (_.isFunction(callback)) {
						return callback(null);
					}
				});
			});
		},

		goToConversation: function () {
			// Close menu
			AppState.toggleMenu(false);

			// Go to selected conversation
			App.Router.navigate("conversation/" + this.model.get('id'), true);
		}
	});

	function onNewMessage () {
		this.$el.find('.conversation-item-latest-message .message-preview').text(this.model.get('messages').last().get('message'));
		this.$el.find('.conversation-item-latest-message .message-timestamp').text(this.model.get('messages').last().get('timestamp').from(moment()));
	}

	function onUnreadMessagesUpdated () {
		var numberOfUnreadMessages = '';
		if (this.model.get('numberOfUnreadMessages') > 0) {
			numberOfUnreadMessages = this.model.get('numberOfUnreadMessages')
		}

		this.$el.find('.badge-unread-messages').text(numberOfUnreadMessages);
	}

	function getCompiledTemplate (model, template, callback) {
		var latestMessage;

		if (model.get('messages').length > 0) {
			latestMessage = model.get('messages').last()
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
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
					// Listen for a latest new message
					that.listenTo(that.model.get('messages'), 'newLatestMessage', onNewMessage, that);

					// Listen for a change in the amount of unread messages
					that.listenTo(that.model, 'change:numberOfUnreadMessages', onUnreadMessagesUpdated, that);

					// Listen for a change in the selected conversation
					that.listenTo(AppState, 'change:currentConversationId', that.onChangeCurrentConversation, that);

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
		},

		onChangeCurrentConversation: function (state, currentConversationId) {
			// If the currently open conversation is the one belonging to this view, set is-selected state class accordingly
			if (currentConversationId === this.model.get('id')) {
				this.$el.addClass('is-selected');
			} else if (this.$el.hasClass('is-selected')) {
				this.$el.removeClass('is-selected');
			}
		}
	});

	function onNewMessage () {
		this.$el.find('.message-preview').text(this.model.get('messages').last().get('message'));
		this.$el.find('.message-timestamp').text(this.model.get('messages').last().getTimestampString());
	}

	function onUnreadMessagesUpdated () {
		elBadge = this.$el.find('.badge-unread-messages')
		var numberOfUnreadMessages = '';

		if (this.model.get('numberOfUnreadMessages') > 0) {
			numberOfUnreadMessages = this.model.get('numberOfUnreadMessages');
			elBadge.removeClass('is-hidden');
		} else {
			elBadge.addClass('is-hidden');
		}

		elBadge.text(numberOfUnreadMessages);
	}

	function getCompiledTemplate (model, template, callback) {
		var latestMessage;

		if (model.get('messages').length > 0) {
			latestMessage = model.get('messages').last()
		} else {
			latestMessage = new Message();
		}

		console.log(latestMessage);

		var compiledTemplate = template({
			latestMessage: new Message(),
			conversation: model.toJSON()
		});

		callback(compiledTemplate);
	}

	return ConversationListView;
});
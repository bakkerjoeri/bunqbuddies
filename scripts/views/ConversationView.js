define([
	'backbone',
	'text!templates/conversation.html',
	'enums/conversationTypes',
	'moment',
	'scripts/modules/DataHandler',
	'scripts/modules/ErrorHandler',
	'scripts/views/MessageView'
], function (Backbone, templateString, conversationTypes, moment, DataHandler, ErrorHandler, MessageView) {

	var ConversationView = Backbone.View.extend({

		events: {
			'change input.input-chat': 'onInputChanged',
			'keydown input.input-chat': 'onKeyDown',
			'click .button-send-message': 'onClickSend'
		},

		initialize: function () {
			DataHandler.currentConversationId = this.model.get('id');

			this.template = _.template(templateString);
			this.subviews = new Array();
			this.noMoreOldMessages = false;
		},

		close: function () {
			DataHandler.currentConversationId = undefined;
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {

					// Add initial batch of messages
					that.addSubviews();

					// Listen for new messages and add them
					that.listenTo(that.model.get('messages'), 'add', that.addMessage, that);

					// Listen for new latest messages
					that.listenTo(that.model.get('messages'), 'newLatestMessage', that.onNewLatestMessage, that);

					// After everything has been set in motion, scroll to the bottom (and latest) of the chat messages
					that.scrollToBottom();

					// When scrolling up, older messages must be fetched. Thus we listen to the scroll event.
					that.$el.find('.view_chat-body').scroll($.proxy(that.onScrollingChat, that));

					if (_.isFunction(callback)) {
						callback(null);
					};
				});
			});
		},

		onInputChanged: function () {
			var input = this.getInput();
			var elButton = this.$el.find('.button-send-message');

			if (input.length > 0) {
				elButton.removeClass('is-disabled');
			} else if (elButton.hasClass('is-disabled')) {
				elButton.addClass('is-disabled');
			}
		},

		onKeyDown: function (e) {
			if (e.keyCode === 13) {
				this.sendMessage();
			}
		},

		onClickSend: function (e) {
			if (!$(e.target).hasClass('is-disabled')) {
				this.sendMessage();
			}
		},

		onNewLatestMessage: function () {
			this.scrollToBottom();
		},

		onScrollingChat: function (event) {
			var currentChatScrollPosition = $(event.target).scrollTop();

			// Only refresh scrolling if user is near the top, the scroll direction is up and fetch state is off
			if (!fetchingTriggered 
				&& previousChatScrollPosition > currentChatScrollPosition 
				&& currentChatScrollPosition < 30
				&& !this.noMoreOldMessages
			) {
				fetchingTriggered = true;
				this.fetchOldMessages();
			} else if (previousChatScrollPosition < currentChatScrollPosition && currentChatScrollPosition >= 30) {
				fetchingTriggered = false;
			}

			// Lastly, set previous scroll position to the current.
			previousChatScrollPosition = currentChatScrollPosition;
		},

		fetchOldMessages: function () {
			var that = this;

			DataHandler.fetchOldMessages(this.model.get('id'), function (error, numberOfFetchedMessages) {
				if (!error) {
					if (!numberOfFetchedMessages > 0) {
						that.noMoreOldMessages = true;
					}
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		sendMessage: function () {
			var message = this.getInput();

			if (message.length > 0) {
				this.resetInput();
				DataHandler.sendMessage(this.model.get('id'), message);
			}
		},

		getInput: function () {
			return $.trim(this.$el.find('.input-chat').val());
		},

		resetInput: function () {
			this.$el.find('.input-chat').val('');
		},

		addSubviews: function () {
			this.addMessages(this.model.get('messages'));
		},

		addMessages: function (messages) {
			messages.each(function (message) {
				this.addMessage(message);
			}, this);
		},

		addMessage: function (message) {
			var messages = this.model.get('messages');
			var messageIndex = messages.indexOf(message);
			var beforeId;
			var afterId;
			
			if (messages.at(messageIndex+1)) {
				beforeId = messages.at(messageIndex+1).get('id');
			}

			if (messages.at(messageIndex-1)) {
				afterId = messages.at(messageIndex-1).get('id');
			}
			
			var messageView = new MessageView({
				el: '.view_chat-body',
				model: message,
				insertAt: {
					beforeId: beforeId,
					afterId: afterId
				}
			});

			messageView.render();
			this.subviews.push(messageView);
		},

		scrollToBottom: function () {
			var messagesContainer = this.$el.find('.view_chat-body');

			messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
			previousChatScrollPosition = messagesContainer.scrollTop();
		}
	});

	var previousChatScrollPosition = 0;
	var fetchingTriggered = false;

	function getCompiledTemplate (model, template, callback) {
		var lastSeen = 'never';
		var otherUser = DataHandler.getOtherUser(model.get('users'));
		if (otherUser && otherUser.lastseen) {
			otherUser.lastseen.from(moment());
		}
		
		var compiledTemplate = template({
			conversationName: model.get('name'),
			conversationType: model.get('type'),
			conversationTypes: conversationTypes,
			numberOfMembers: model.get('users').length,
			lastSeen: lastSeen
		});

		callback(null, compiledTemplate);
	}

	return ConversationView;
});
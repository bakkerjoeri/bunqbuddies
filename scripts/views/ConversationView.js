define([
	'backbone',
	'text!templates/conversation.html',
	'enums/conversationTypes',
	'moment',
	'scripts/modules/DataHandler',
	'scripts/views/MessageView'
], function (Backbone, templateString, conversationTypes, moment, DataHandler, MessageView) {

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
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {

					// Add initial batch of messages
					that.addSubviews(that.model.get('messages'));

					// Listen for new messages and add them
					that.listenTo(that.model.get('messages'), 'add', that.addMessage, that);

					// Listen for new latest messages
					that.listenTo(that.model.get('messages'), 'newLatestMessage', that.onNewLatestMessage, that);

					// After everything has been set in motion, scroll to the bottom (and latest) of the chat messages
					that.scrollToBottom();

					if (_.isFunction(callback)) {
						callback(null);
					};
				});
			});
		},

		close: function () {
			DataHandler.currentConversationId = undefined;
			this.stopListening();
			this.undelegateEvents();
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

		addSubviews: function (parent) {
			this.addMessages(parent);
		},

		addMessages: function (messages) {
			messages.each(function (message) {
				this.addMessage(message);
			}, this);
		},

		addMessage: function (message) {
			var messageView = new MessageView({
				el: '.view_chat-body',
				model: message
			});

			messageView.render();
			this.subviews.push(messageView);
		},

		scrollToBottom: function () {
			var messagesContainer = this.$el.find('.view_chat-body');

			messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
		}
	});

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
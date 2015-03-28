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
			this.template = _.template(templateString);
			this.subviews = new Array();
			DataHandler.currentConversationId = this.model.get('id');
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {

					addSubviews(that);
					// Listen for new messages and add them
					that.listenTo(that.model.get('messages'), 'add', that.addMessage, that);


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
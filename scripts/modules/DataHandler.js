define([
	'backbone',
	'scripts/modules/RequestHandler',
	'scripts/modules/ErrorHandler',
	'enums/conversationTypes',
	'scripts/collections/Conversations',
	'scripts/models/User',
	'scripts/collections/Users',
	'scripts/collections/Messages'
], function (Backbone, RequestHandler, ErrorHandler, conversationTypes, Conversations, User, Users, Messages) {
	
	function parseConversationData (conversationData) {
		// Determine the conversation name, which can either be the groupchat's name, or the name of the other user.
		var conversationName = '';
		if (conversationData.conversation.type === conversationTypes.PERSONAL || conversationData.conversation.name === null) {
			conversationName = _.map(_.reject(conversationData.users, function (user) {
				return user.userid === DataHandler.currentUser.get('id');
			}), function (user) {
				return DataHandler.getUser(user.userid).get('name');
			}).join(', ');
		} else {
			conversationName = conversationData.conversation.name;
		}
		
		return {
			id: 		conversationData.conversation.id,
			name: 	conversationName,
			type: 	conversationData.conversation.type,
			users: 	conversationData.users
		}
	}
	
	function loadConversations (callback) {
		DataHandler.getCurrentUser(function (error, currentUser) {
			if (!error) {
				RequestHandler.getConversationsOfUser(currentUser.get('id'), function (error, conversationsData) {
					if (!error) {
						DataHandler.conversations = new Conversations(_.map(conversationsData, function(conversationData) {
							return parseConversationData(conversationData);
						}));

						DataHandler.conversations.each(function (conversation) {
							DataHandler.updateMessages(conversation.get('id'));
						});

						callback(null, DataHandler.conversations);
					} else {
						callback(error);
					}
				});
			} else {
				callback(error);
			}
		});
	}

	// Fetch to the latest 20 messages of a conversation
	function fetchMessages (conversation, callback) {
		var conversationId = conversation.get('id');

		RequestHandler.getLimitedMessages(conversationId, 20, 0, callback);
	}

	// Fetch any new messages since the latest
	function fetchNewMessages (conversation, callback) {
		var conversationId = conversation.get('id')
		var latestMessageId = 

		RequestHandler.getNewMessagesSinceMessage(conversationId, latestMessageId, callback);
	}

	var DataHandler = _.extend({
		initialize: function () {
			this.currentUser = new User();
			this.login();
		},

		login: function (callback) {
			RequestHandler.getUsers(function (error, users) {
				if (!error) {
					DataHandler.users = new Users(users);

					// Select a random user to login
					// DataHandler.currentUser = DataHandler.users.sample();
					DataHandler.currentUser = new User(users[0]);

					// Trigger the 'loggedIn' event
					DataHandler.trigger('loggedIn');

					if (_.isFunction(callback)) {
						return callback(null, DataHandler.currentUser);
					}
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		updateMessages: function (conversationId, callback) {
			var that = this;

			var conversation = DataHandler.conversations.findWhere({
				id: conversationId
			});

			if (!conversation) {
				return callback({
					message: "Could not update messages. No conversation with id " + conversationId + " found."
				});
			}

			console.log("Let's update conversation " + conversationId);

			if (!conversation.get('messages').length > 0) {
				console.log("No messages yet. Let's load some up.");

				fetchMessages(conversation, function (error, messagesData) {
					if (!error) {
						conversation.set('messages', new Messages(messagesData));

						console.log("Messages for conversation " + conversationId + " fetched:");
						console.log(conversation.get('messages').toJSON());

						// that.updateMessages(conversationId, function() {});
					} else {
						ErrorHandler.report(error);
					}
				});
			} else {
				console.log("Some messages are present. Let's see if we can find some new ones.");

				fetchNewMessages(conversation, function (error, messagesData) {
					if (!error) {
						messages = conversation.get('messages');
						console.log(messagesData);
						var numberOfNewMessages = messagesData.length;

						console.log(numberOfNewMessages);

						if (numberOfNewMessages > 0) {
							messages.add(messagesData, {sort: false});
							messages.sort();
							conversation.set('numberOfNewMessages', numberOfNewMessages);
							conversation.trigger('messages:new');
						}

						return callback(null);
					} else {
						return ErrorHandler.report(error);
					}
				});
			}
		},

		getUser: function (userId) {
			return this.users.findWhere({
				id: userId
			})
		},

		getCurrentUser: function (callback) {
			if (!this.currentUser) {
				this.login(callback);
			} else {
				callback(null, this.currentUser);
			}
		},

		getConversations: function (callback) {
			if (!this.conversations) {
				loadConversations(callback);
			} else {
				callback(null, this.conversations);
			}
		}
	}, Backbone.Events);

	return DataHandler;
});
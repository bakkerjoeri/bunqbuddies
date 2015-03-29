define([
	'backbone',
	'async',
	'scripts/modules/RequestHandler',
	'scripts/modules/ErrorHandler',
	'enums/conversationTypes',
	'scripts/models/Conversation',
	'scripts/collections/Conversations',
	'scripts/models/User',
	'scripts/collections/Users',
	'scripts/collections/Messages'
], function (Backbone, async, RequestHandler, ErrorHandler, conversationTypes, Conversation, Conversations, User, Users, Messages) {

	var updateAttempts = 0;
	var defaultUpdateTime = 1000; // Default update cycle delay in milliseconds is 0.5 seconds.
	var maxUpdateTime = 1*60*1000; // Maximum update cycle delay in milliseconds is 1 minute.

	// Updates conversations and messages.
	// After every update (regardless of success), the cycle restarts after 0.5 seconds.
	// After 5 consecutive failed attempts, the cycle will stop.
	function update () {

		DataHandler.updateConversations(function (error) {
			if (!error) {
				updateAttempts = 1;
			} else {
				updateAttempts++;
				ErrorHandler.report(error);
			}

			// Set timeout for next update cycle. Every attempt adds 10% extra delay
			var delay = Math.floor(defaultUpdateTime * Math.pow(1.1, updateAttempts - 1));
			if (delay > maxUpdateTime) { delay = maxUpdateTime; }
			return setTimeout(update, delay);
		});
	}
	
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
			users: 	new Users(conversationData.users)
		}
	}

	// Fetch and parse the JSON objects of the conversations
	function fetchConversations (callback) {
		DataHandler.getCurrentUser(function (error, currentUser) {
			if (!error) {
				RequestHandler.getConversationsOfUser(currentUser.get('id'), function (error, conversationsData) {
					if (!error) {
						var fetchedConversations = _.map(conversationsData, function(conversationData) {
							return parseConversationData(conversationData);
						});

						callback(null, fetchedConversations);
					} else {
						callback(error);
					}
				});
			} else {
				callback(error);
			}
		});
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
							DataHandler.updateMessages(conversation.get('id'), function () {});
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

		return RequestHandler.getLimitedMessages(conversationId, 20, 0, callback);
	}

	// Fetch any new messages since the latest
	function fetchNewMessages (conversation, callback) {
		var conversationId = conversation.get('id');

		var latestMessageId = 0;
		if (conversation.get('messages').length > 0) {
			latestMessageId = conversation.get('messages').last().get('id');
		} 

		return RequestHandler.getNewMessagesSinceMessage(conversationId, latestMessageId, callback);
	}

	var DataHandler = _.extend({
		initialize: function () {
			this.currentUser = new User();
			this.users = new Users();
			this.conversations = new Conversations();
			this.currentConversationId;
			this.login();
		},

		login: function (callback) {
			RequestHandler.getUsers(function (error, users) {
				if (!error) {
					DataHandler.users = new Users(users);

					// Select a random user to login
					DataHandler.currentUser = DataHandler.users.sample();
					// DataHandler.currentUser = new User(users[0]);

					// Trigger the 'loggedIn' event
					DataHandler.trigger('loggedIn');

					// Start the update cycle
					update();

					if (_.isFunction(callback)) {
						return callback(null, DataHandler.currentUser);
					}
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		updateConversations: function (callback) {
			fetchConversations(function (error, conversationsData) {
				if (!error) {
					DataHandler.conversations.set(conversationsData);

					async.each(DataHandler.conversations.toArray(), function (conversation, callback) {
						DataHandler.updateMessages(conversation, callback);
					}, callback);
				} else {
					return callback(error);
				}
			});
		},

		updateMessages: function (conversation, callback) {
			var currentConversationId = this.currentConversationId;
			var messages = conversation.get('messages');

			// Reset unread messages to 0 if the current conversation is selected and has unread messages
			if (conversation.get('id') === currentConversationId && conversation.get('numberOfUnreadMessages') > 0) {
				conversation.set('numberOfUnreadMessages', 0);
			}

			if (!messages.length > 0) {
				fetchMessages(conversation, function (error, messagesData) {
					if (!error) {
						if (messagesData.length > 0) {
							messages.add(messagesData);
							messages.trigger('newLatestMessage');
						}

						return callback(null);
					} else {
						ErrorHandler.report(error);
						return callback(error);
					}
				});
			} else {
				fetchNewMessages(conversation, function (error, messagesData) {
					if (!error || error.status === 503) {
						if (messagesData) {
							var numberOfNewMessages = messagesData.length;

							// if there are any new messages, add them
							if (numberOfNewMessages > 0) {
								messages.add(messagesData);
								messages.trigger('newLatestMessage');

								// update number of unread messages if the currently open conversation is not the updated one
								if (conversation.get('id') !== currentConversationId) {
									conversation.set('numberOfUnreadMessages', conversation.get('numberOfUnreadMessages') + numberOfNewMessages);
								}
							}
						}

						return callback(null);
					} else {
						ErrorHandler.report(error);
						return callback(error);
					}
				});
			}
		},

		getUser: function (userId) {
			return this.users.findWhere({
				id: userId
			}) || new User();
		},

		getCurrentUser: function (callback) {
			if (!this.currentUser) {
				this.login(callback);
			} else {
				callback(null, this.currentUser);
			}
		},

		getOtherUser: function (users) {
			var otherUsers = users.reject(function (user) {
				return user.get('userid') === this.currentUser.get('id')
			}, this);

			return otherUsers[0];
		},

		getOtherUsers: function () {
			return new Users(this.users.without(this.currentUser));
		},

		getConversations: function (callback) {
			if (!this.conversations) {
				loadConversations(callback);
			} else {
				callback(null, this.conversations);
			}
		},

		getConversation: function (conversationId) {
			return this.conversations.findWhere({
				id: conversationId
			}) || new Conversation();
		},

		sendMessage: function (conversationId, message) {
			RequestHandler.postMessage(conversationId, this.currentUser.get('id'), message, function (error, response) {
				if (!error) {
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		createConversation: function (participants, conversationName, callback) {
			// A conversation of up to 2 people is a personal, anything else is a group conversation.
			if (participants.length <= 2) {
				RequestHandler.createPersonalConversation(participants, callback);
			} else {
				RequestHandler.createGroupConversation(participants, conversationName, callback);
			}
		}

	}, Backbone.Events);

	return DataHandler;
});
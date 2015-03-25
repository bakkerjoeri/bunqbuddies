define([
	'scripts/modules/RequestHandler',
	'scripts/modules/ErrorHandler',
	'enums/conversationTypes',
	'scripts/collections/Conversations',
	'scripts/models/User',
	'scripts/collections/Users'
], function (RequestHandler, ErrorHandler, conversationTypes, Conversations, User, Users) {
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

	var DataHandler = {
		initialize: function () {

		},

		login: function (callback) {
			var that = this;

			RequestHandler.getUsers(function (error, users) {
				if (!error) {
					that.users = new Users(users);
					// Select a random user to login
					that.currentUser = new User(_.sample(users));
					callback(null, that.currentUser);
				} else {
					ErrorHandler.report(error);
				}
			});
		},

		getUser: function (id) {
			return this.users.findWhere({
				id: id
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
	}

	return DataHandler;
});
define([
	'scripts/models/User',
	'scripts/collections/Users',
	'scripts/models/UserState',
	'scripts/modules/RequestHandler'
], function (User, Users, UserState, RequestHandler) {
	var UserHandler = {
		login: function (callback) {
			var that = this;

			RequestHandler.getUsers(function (error, users) {
				if (!error) {
					// Select a random current user
					var selectedUser = _.sample(users);

					// Set this random user as currently logged in user
					UserState.setCurrentUser(selectedUser);

					// Set the fetched users as contacts
					UserState.setContacts(users);

					callback(UserState.get('currentUser'));
				} else {
					console.log("Could not get users for login.");
				}
			});
		},

		loadContacts: function (callback) {
			RequestHandler.getUsers(function (error, users) {
				if (!error) {
					// Set the fetched users as contacts
					UserState.setContacts(users);

					callback(UserState.get('contacts'));
				} else {
					console.log("Could not get users for contacts.");
				}
			});
		},

		loadConversations: function (callback) {
			RequestHandler.getConversationsOfUser(UserState.get('currentUser').get('id'), function (error, conversations) {
				if (!error) {
					UserState.setConversations(conversations);

					callback(UserState.get('conversations'));
				} else {
					console.log("Could not get conversations.");
				}
			});
		}
	}

	return UserHandler;
})
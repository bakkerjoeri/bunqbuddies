define([
	'backbone',
	'scripts/models/User',
	'scripts/collections/Users',
	'scripts/models/Conversation',
	'scripts/collections/Conversations'
], function (Backbone, User, Users, Conversation, Conversations) {

	var AppState = Backbone.Model.extend({
		defaults: {
			currentUser: new User(),
			conversations: new Conversations(),
			contacts: new Users()
		},

		initialize: function (options) {

		},

		setCurrentUser: function (userData) {
			this.set({
				currentUser: new User(userData)
			});
		},

		setConversations: function (conversationData) {
			this.set({
				conversations: new Conversations(conversationData)
			});
		},

		setContacts: function (usersData) {
			this.set({
				contacts: new Users(_.reject(usersData, function (user) {
					return user.id === this.get('currentUser').get('id');
				}, this))
			});
		}
	});

	return new AppState;
});
define([
	'backbone',
	'enums/conversationTypes',
	'scripts/collections/Users',
	'scripts/collections/Messages'
], function (Backbone, conversationTypes, Users, Messages) {

	var Conversation = Backbone.Model.extend({

		defaults: {
			id: 										new String(),
			name: 									new String(),
			type: 									conversationTypes.UNDEFINED,
			numberOfUnreadMessages: 0,
			users: 									null,
			messages: 							null
		},

		initialize: function (options) {
			this.set({
				users: new Users(options.users || []),
				messages: new Messages(options.messages || [])
			})
		}

	});

	return Conversation;
});
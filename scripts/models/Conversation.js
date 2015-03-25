define([
	'backbone',
	'enums/conversationTypes',
	'scripts/collections/Users',
	'scripts/collections/Messages'
], function (Backbone, conversationTypes, Users, Messages) {

	var Conversation = Backbone.Model.extend({

		defaults: {
			id: 									new String(),
			name: 								new String(),
			type: 								conversationTypes.UNDEFINED,
			numberOfNewMessages: 	0,
			users: 								new Users(),
			messages: 						new Messages()
		},

		initialize: function () {
		}

	});

	return Conversation;
});
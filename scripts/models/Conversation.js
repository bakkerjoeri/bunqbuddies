define([
	'backbone',
	'enums/conversationTypes',
	'scripts/collections/Users'
], function (Backbone, conversationTypes, Users) {

	var Conversation = Backbone.Model.extend({

		defaults: {
			id: 									new String(),
			name: 								new String(),
			type: 								conversationTypes.UNDEFINED,
			numberOfNewMessages: 	0,
			users: 								new Users()
		},

		initialize: function () {
		}

	});

	return Conversation;
});
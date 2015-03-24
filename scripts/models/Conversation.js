define([
	'backbone',
	'enums/conversationTypes',
	'scripts/collections/Users'
], function (Backbone, conversationTypes, Users) {

	var Conversation = Backbone.Model.extend({

		defaults: {
			id: 		new String(),
			name: 	new String(),
			type: 	conversationTypes.UNDEFINED,
			users: 	new Users()
		},

		initialize: function (options) {
			if (options) {
				this.set(options.conversation);
				this.set('users', new Users(options.users));
			}
		}

	});

	return Conversation;
});
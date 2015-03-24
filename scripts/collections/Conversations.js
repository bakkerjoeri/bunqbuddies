define([
	'scripts/models/Conversation'
], function (Conversation) {

	var Conversations = Backbone.Collection.extend({

		model: Conversation
	});

	return Conversations;
});
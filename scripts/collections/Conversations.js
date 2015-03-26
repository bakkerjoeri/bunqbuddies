define([
	'scripts/models/Conversation'
], function (Conversation) {

	var Conversations = Backbone.Collection.extend({

		model: Conversation,

		comparator: function (current, other) {
			if (current.get('messages').length > 0) {
				if (other.get('messages').length > 0) {
					return (current.get('messages').first().get('timestamp') - other.get('messages').first().get('timestamp'));
				} else {
					return 1;
				}
			} else if (other.get('messages').length > 0) {
				return -1;
			} else {
				return (current.get('name') - other.get('name'));
			}

			return 0
		}
	});

	return Conversations;
});
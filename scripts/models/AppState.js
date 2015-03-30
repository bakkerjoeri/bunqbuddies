define([
	'backbone'
], function (Backbone) {
	
	var AppState = Backbone.Model.extend({
		defaults: {
			menuOpen: true,
			currentConversationId: -1
		},

		toggleMenu: function (isOpen) {
			if (isOpen === undefined) {
				isOpen = !this.get('menuOpen');
			}

			this.set('menuOpen', isOpen);
		},

		resetCurrentConversationId: function () {
			this.set('currentConversationId', -1);
		}
	});

	return new AppState;
});
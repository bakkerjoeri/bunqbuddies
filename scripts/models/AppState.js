define([
	'backbone'
], function (Backbone) {
	
	var AppState = Backbone.Model.extend({
		defaults: {
			menuOpen: true,
			currentConversation: -1
		},

		toggleMenu: function(isOpen) {
			if (isOpen === undefined) {
				isOpen = !this.get('menuOpen');
			}

			this.set('menuOpen', isOpen);
		}
	});

	return new AppState;
});
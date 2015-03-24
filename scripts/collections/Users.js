define([
	'scripts/models/User'
], function (User) {

	var Users = Backbone.Collection.extend({

		model: User
	});

	return Users;
});
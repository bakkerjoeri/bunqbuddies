define([
	'backbone',
	'text!templates/newConversation.html',
	'scripts/modules/DataHandler'
], function (Backbone, templateString, DataHandler) {

	var NewConversationView = Backbone.View.extend({

		events: {
			'click .button-cancel': 'onClickCancel'
		},

		initialize: function () {
			this.template = _.template(templateString);
		},

		close: function () {
			
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.model, this.template, function (error, compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		onClickCancel: function (event) {
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({
			selectableUsers: DataHandler.users.toJSON()
		});

		callback(null, compiledTemplate);
	}

	return NewConversationView;

});
define([
	'backbone',
	'text!templates/newConversation.html'
], function (Backbone, templateString) {

	var NewConversationView = Backbone.View.extend({

		events: {

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
		}
	});

	function getCompiledTemplate (model, template, callback) {
		var compiledTemplate = template({

		});

		callback(null, compiledTemplate);
	}

	return NewConversationView;

});
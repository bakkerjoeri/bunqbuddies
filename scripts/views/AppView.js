define([
	'backbone',
	'text!templates/app.html',
	'scripts/views/MenuView'
], function (Backbone, templateString, MenuView) {
	
	// Public object
	var AppView = Backbone.View.extend({
		
		initialize: function () {
			this.template = _.template(templateString);
		},

		close: function () {
			
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();
					
					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		}
	});

	// Private methods and variables
	function getCompiledTemplate (template, callback) {
		var compiledTemplate = template({

		});

		callback(compiledTemplate);
	}

	function addSubviews () {
		addMenuView();
	}

	function addMenuView () {
		new MenuView({
			el: '.view_menu'
		}).render();
	}

	return AppView;
});
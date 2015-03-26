define([
	'backbone',
	'scripts/modules/DataHandler',
	'text!templates/app.html',
	'scripts/views/MenuView',
	'scripts/views/HomeView',
	'scripts/views/ConversationView',
	'scripts/views/NewConversationView'
], function (Backbone, DataHandler, templateString, MenuView, HomeView, ConversationView, NewConversationView) {
	
	// Public object
	var AppView = Backbone.View.extend({
		
		initialize: function () {
			this.template = _.template(templateString);
			this.currentView = null;
		},

		close: function () {
			
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();

					Backbone.history.start();
					App.Router.navigate('/');

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});

			this.listenTo(App.Router, "route:home", this.loadHome);
			this.listenTo(App.Router, "route:new", this.loadNewConversation);
			this.listenTo(App.Router, "route:conversation", this.loadConversation);
		},

		changeView: function (newView) {
			if (this.currentView) {
				this.closeView(this.currentView);
			}

			newView.render();
			this.currentView = newView;
		},

		closeView: function (view) {
			view.unbind();
			view.stopListening();
			view.close();
		},

		loadHome: function () {
			this.changeView(new HomeView({
				el: '.view_content'
			}));
		},

		loadConversation: function (conversationId) {
			this.changeView(new ConversationView({
				el: '.view_content',
				model: DataHandler.getConversation(conversationId)
			}));
		},

		loadNewConversation: function () {
			this.changeView(new NewConversationView({
				el: '.view_content'
			}));
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
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

		listenToRoutes: function () {
			this.listenTo(App.Router, "route:home", this.loadHome);
			this.listenTo(App.Router, "route:new", this.loadNewConversation);
			this.listenTo(App.Router, "route:conversation", this.loadConversation);
		},

		render: function (callback) {
			var that = this;

			getCompiledTemplate(this.template, function (compiledTemplate) {
				that.$el.html(compiledTemplate).promise().done(function () {
					addSubviews();

					Backbone.history.start();
					that.listenToRoutes();
					that.loadHome();
					App.Router.navigate('/', {trigger: false, replace: true});

					if (_.isFunction(callback)) {
						callback(null);
					}
				});
			});
		},

		changeView: function (newViewClass, options) {
			if (this.currentView) {
				this.closeView(this.currentView);
			}

			var newView = new newViewClass(options);

			newView.render();
			this.currentView = newView;
		},

		closeView: function (view) {
			view.unbind();
			view.stopListening();
			view.undelegateEvents();
			view.close();
		},

		loadHome: function () {
			this.changeView(HomeView, {
				el: '.view_content'
			});
		},

		loadConversation: function (conversationId) {
			this.changeView(ConversationView, {
				el: '.view_content',
				model: DataHandler.getConversation(conversationId)
			});
		},

		loadNewConversation: function () {
			this.changeView(NewConversationView, {
				el: '.view_content'
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
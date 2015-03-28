#	BunqBuddies
BunqBuddies is a chat app created as an exercise for frontend development. A live implementation can be found at [bunq.joeri.me](http://bunq.joeri.me).

## Features

### As of version 0.7.0
* 	When the app loads, you are logged as one of 5 test users.
* 	You can select conversations and send messages to the other members of this conversation.
* 	Messages and conversations are live updated every 0.5 seconds or so, depending on server latency. Closed conversations will display the number of unread messages.

### Planned features
*	0.8
    * Being able to start new conversations
    * Fetch and display older messages as you scroll up

*   0.9
    * Label the point at which unread messages start
    * Automatic sorting of conversation items

*   1.0 (release)
    * Implement a sleek design
    * Responsive UI
    * Browser notifications

*   2.0
    * User accounts
    * New API

## Libraries and frameworks
BunqBuddies uses a few different libraries and frameworks to introduce a modular and more structured way of writing code, not reinvent the wheel and keep the focus on solving the problems specific to building a chat app.

* 	[RequireJS][] is a modular script loader that enforces an AMD workflow. This helps keep things structured and makes dependency loading very straightforward.
* 	[Backbone.js][] is used as a framework for MV* development.
* 	[Underscore.js][] is a javascript toolbox that not only introduces numerous useful helpers, but also provides a templating engine and works in close conjunction with Backbone.js.
* 	[i18next][] provides internationalisation, translation and support of language files.
* 	[Moment.js][] helps parsing and formatting dates and incorperating the set locale and timezone.
* 	[Compass][] is a [Sass][]-based CSS framework. It features nesting, cross-browser compatability options and ways to cleanly structure CSS project files.

[RequireJS]: http://requirejs.org/
[Backbone.js]: http://backbonejs.org/
[Underscore.js]: http://underscorejs.org/
[i18next]: http://i18next.com/
[Moment.js]: http://momentjs.com/
[Compass]: http://compass-style.org/
[Sass]: http://sass-lang.com/
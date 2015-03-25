define([
], function () {

	var ErrorHandler = {

		report: function (error) {
			var errorMessage = error.message;

			if (error.status !== undefined) {
				errorMessage += " (" + error.status + ")";
			}

			console.error(errorMessage);
		}
	}

	return ErrorHandler;
});
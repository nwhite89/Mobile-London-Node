$(document).delegate('#journeyFavs', 'pageshow', userJourneys);

function userJourneys() {
	if (typeof(Storage)!=='undefined') {
	// User's device supports HTML5 Local Storage now test if they have any favourite Journeys
		if (localStorage.getItem('journeyPlanner')) {
			var journeys = JSON.parse(localStorage.getItem('journeyPlanner'));
			var buttons = '', editButtons = '';
			$.each(journeys, function (i, item) {
				var url = '/planner?from=' + item.from + '&fromType=' + item.fType + '&to=' + item.to + '&toType=' + item.tType;
				buttons += '<a style=\'white-space: normal;\' href=\'' + url + '\' data-role=\'button\'>From: ' + item.from + '<br />To: ' + item.to + '</a>';
			});
			$('div#favContent').html('<div id=\'journey\' data-role=\'controlgroup\' data-ajax=\'false\'>' + buttons + '</div>').trigger('create');
		} else {
			$('a#edit').hide();
			$('div#favContent p').text('Sorry but no favourite journeys could be found.');
		}
	} else {
		$('a#edit').hide();
		$('div#favContent p').text('Apologies but it seems that your device dosn\'t support this feature.');
	}
};
$(document).delegate('#journeyMain', 'pageshow', function () {
	$('a#favJourney').bind('tap', function () { 
		addJourney(this.rel);
	});
	if (typeof(Storage)!=='undefined') {
		checkJourney($('a#favJourney').attr('rel'));
	} else {
		$('div#favJourney').hide();
	}
});

function checkJourney(rel) {
	if (localStorage.getItem('journeyPlanner')) {
		// Recieve current favourites
		var favJourneys = JSON.parse(localStorage.getItem('journeyPlanner'));
		// Check if journey already exists
		var 	newFav = rel.split('?')
			,	check
			;
		$.each(favJourneys, function (i, item) {
			if (item.from == newFav[0] && item.to == newFav[1]) {
				check = 1;
			}
		});
		if (check == 1) {
			$('div#favourite').show();
			$('div#favJourney').hide();
		}
	}
}

function addJourney(rel) {
	if (typeof(Storage)!=='undefined') {
		// User's device supports HTML5 Local Storage now test if they have any favourite Bus Stops
		if (localStorage.getItem('journeyPlanner')) {
			// Recieve current favourites
			var favJourneys = JSON.parse(localStorage.getItem('journeyPlanner'));
			// Check if journey already exists
			var 	newFav = rel.split('?')
				,	check
				;
			$.each(favJourneys, function (i, item) {
				if (item.from == newFav[0] && item.to == newFav[1]) {
					check = 1;
				}
			});
			if (check != 1) {
				favJourneys.push({'from': newFav[0], 'to': newFav[1], 'fType': newFav[2], 'tType': newFav[3]});
				localStorage.setItem('journeyPlanner', JSON.stringify(favJourneys));
				$('div#favourite').show();
				$('div#favJourney').hide();
			}
		} else {
			var newFav = rel.split('?');
			journey = new Array();
			journey.push({'from': newFav[0], 'to': newFav[1], 'fType': newFav[2], 'tType': newFav[3]});
			localStorage.setItem('journeyPlanner', JSON.stringify(journey));
			$('div#favourite').show();
			$('div#favJourney').hide();
		}
	} else {
		$('a#favJourney').hide();
	}
};
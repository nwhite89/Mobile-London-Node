$(document).delegate('#busFavs', 'pageshow', userBusStops);
function userBusStops() {
	// Test that the user's device supports HTML5 Local Storage
	if (typeof(Storage)!=='undefined') {
		// User's device supports HTML5 Local Storage now test if they have any favourite Bus Stops
		if (localStorage.getItem('busStops')) {
			// Retrieve users favourites and convert to a JSON Object
			var favBusStops = localStorage.getItem('busStops');
			var jsonBusStops = JSON.parse(favBusStops);
			var buttons = '';
			var editButtons = '';
			// Create buttons for all of the favourite bus stops
			$.each(jsonBusStops, function (i, item) {
				buttons += '<a href=\'/favs/buses/stop?sID=' + item.id + '&name=' + item.name + '\' data-role=\'button\'>' + item.name + '</a>';
			});
			$('div#favContent').html('<div id=\'busFavs\' data-role=\'controlgroup\' data-ajax=\'false\'>' + buttons + '</div>').trigger('create');
		} else {
			$('a#edit').hide();
			$('div#favContent p').text('Sorry but no favourite bus stops could be found.');
		}
	} else {
		$('a#edit').hide();
		$('div#favContent p').text('Apologies but it seems that your device dosn\'t support this feature.');
	}
};
$(document).delegate('#editBus', 'pageshow', userBusStopsEdit);
$(document).delegate('#editBus', 'pagecreate', function () {
	$('a#delete').bind('tap', function () {  
		newFavs();
	});
	$('a#clear').bind('tap', function () { 
		clearFavs();
	});
});
function clearFavs() {
	localStorage.setItem('busStops', '');
	$('div#editContent').html('<p>Your favourites have been cleared.</p>');
	$('a#delete').hide().trigger('updatelayout');
	$('a#clear').hide().trigger('updatelayout');
};
function newFavs() {
	var deleteBus = $('fieldset div input');
	jsonBusStops = new Array();
	// Check all of the stops wants to delete
	$.each(deleteBus, function (i, item) {
		if (!$(this).next().hasClass('ui-checkbox-on')) { 
			//alert($(this).attr('rel'));
			var newStop = $(this).attr('rel').split('?');
			jsonBusStops.push({"id": newStop[0], "name": newStop[1], "geo": newStop[2]});
		}
	});
	localStorage.setItem('busStops', JSON.stringify(jsonBusStops));
	window.location = "/favs/buses";
};
function userBusStopsEdit() {
	// Test that the user's device supports HTML5 Local Storage
	if (typeof(Storage)!=='undefined') {
		// User's device supports HTML5 Local Storage now test if they have any favourite Bus Stops
		if (localStorage.getItem('busStops')) {
			// Retrieve users favourites and convert to a JSON Object
			var favBusStops = localStorage.getItem('busStops');
			var jsonBusStops = JSON.parse(favBusStops);
			var buttons = '';
			// Create buttons for all of the favourite bus stops
			$.each(jsonBusStops, function (i, item) {
				var rel = item.id + '?' + item.name + '?' + item.geo;
				buttons += '<input type=\'checkbox\' name=\'' + item.id + '\' id=\'' + item.id + '\' rel=\'' + rel + '\'/><label for=\'' + item.id + '\'>' + item.name + '</label>';
			});
			$('div#editContent div fieldset').html('<div id=\'busFavs\' data-role=\'controlgroup\' data-ajax=\'false\'>' + buttons + '</div>').trigger('create');
		} else {
			$('a#clear').hide();
			$('div#favContent p').text('Sorry but no favourite bus stops could be found.');
		}
	} else {
		$('a#clear').hide();
		$('div#favContent p').text('Apologies but it seems that your device dosn\'t support this feature.');
	}
};
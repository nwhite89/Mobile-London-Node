 $(window).bind('orientationchange', function () {
	// Reset the center of the map if the user has changed the orientation of their device
	$('#map_canvas').gmap('refresh');
	var center = $('#map_canvas').gmap('get', 'markers > 0');
	$('#map_canvas').gmap('get', 'map').panTo(center.position);
})
// Check to see if the Map page has been created
$(document).delegate('#map', 'pagecreate', function () {
	// Add Google Maps to the page and show the users current location													 
	$('#map_canvas').gmap({
		'center': LatLng, 
		'zoom': 15, 
		'disableDefaultUI': true,
		'callback':function() {
			this.addMarker({
				'position': LatLng, 
				'bounds': false
			});
		}
	});
	// Add 10 of the closest bus stops to the users current location
	var busImage  = '/images/busStop.png';
	$('#map_canvas').gmap().bind('init', function () {
		$.each(markers, function(i, stop) {
			$('#map_canvas').gmap('addMarker', {
				'title': stop.name,
				'position': stop.geo, 
				'bounds': false,
				'icon': busImage,
				'routes': stop.route
			}).click(function(){
				// On click of bus stop display Bus stop information and Countdown
				stopCountdown(stop.id);
				checkFav(stop.id);
				var dialog = $('div#info');
				if (typeof(Storage)==='undefined') { $(dialog).find('div#addFavs').hide(); }
				if (typeof(Storage)==='undefined') { $(dialog).find('div#fav').hide(); }
				$(dialog).find('a#addFavs').attr('rel', stop.id + "?" + stop.name + "?" + stop.geo);
				$(dialog).find('h1#stop').text(stop.name);
				$(dialog).find('p#distance').html("<strong>Distance: </strong>" + stop.distance + " meters");
				$(dialog).find('p#routes').html("<strong>Routes: </strong>" + stop.routeStr);
				$.mobile.changePage($('div#info'), {
					role: 'dialog', 
					transition: 'slidedown'
				});
			});
		});		
	});
	// Bind the filter functions for bus stops
	$('a.showAll').bind('tap', function () {
		showAllStops();
	});
	$('a.filterRoutes').bind('tap', function () {
		filterOptions();
	});
});
// On hiding the Bus stop information page Refresh Google map and reset the center position
$('div#info').live('pagehide', function(event) {
	$('#map_canvas').gmap('refresh');
	var center = $('#map_canvas').gmap('get', 'markers > 0');
	$('#map_canvas').gmap('get', 'map').panTo(center.position);
	$('div#countdown').html("<div class='ajaxLoader'/>");
});
// On hiding the Bus stop information page Refresh Google map and reset the center position
$('div#options').live('pagehide', function(event) {
	$('#map_canvas').gmap('refresh');
	var center = $('#map_canvas').gmap('get', 'markers > 0');
	$('#map_canvas').gmap('get', 'map').panTo(center.position);
	$('div#countdown').html("<div class='ajaxLoader'/>");
});




$(document).delegate('#map', 'pageshow', function () {
	setMap();	
	$('#map_canvas').gmap('refresh');
	$('#map_camvas').gmap(LatLng);						   
});
$(document).delegate('#info', 'pageshow', function () {
	$('a#addFavs').bind('click', function () { 
		// Recieve new favourite
		var newStop = this.rel.split('?');
		// Check if user already has favourites
		if (localStorage.getItem('busStops')) {
			// Recieve current favourites
			var favStops = localStorage.getItem('busStops');
			var jsonFavStops = JSON.parse(favStops);
			// Check if stop is already a part of users favourites
			var check = 0;
			$.each(jsonFavStops, function(i, item) {
				if(item.id == newStop[0]) {	check++; }
			});
			if (check == 0) { 
				jsonFavStops.push({"id": newStop[0], "name": newStop[1], "geo": newStop[2]});
				localStorage.setItem('busStops', JSON.stringify(jsonFavStops));
				$('div#addFavs').hide(); 
				$('div#fav').show();
			};
		} else { 
			// Create new favourite for user
			var busStorage = [ {"id": newStop[0], "name": newStop[1], "geo": newStop[2]} ]
			localStorage.setItem('busStops', JSON.stringify(busStorage));
			$('div#addFavs').hide(); 
			$('div#fav').show();
		}
	});
});
function setMap() {
    // Calculate how large the map canvas should be taking into account the header, footer and the users viewport
   	var contentDiv = $("div#map #main");
    var mapSize = $(window).height() - $("div#map #header").outerHeight() - $("div#map #footer").outerHeight();
	// Remove any padding
    mapSize -= (contentDiv.outerHeight() - contentDiv.height());
    $('#map_canvas').height(mapSize-12);
};
// Recieve bus stop countdown information
function stopCountdown(sid) {
	$.get("/bus/show?sid=" + sid, function (data) {
		$('div#countdown').html(data);
	});
}; 
// Check what bus routes user wants
function filterOptions() {
	var filterForm = $('fieldset#routes div input');
	var amount = 0;
	// Check all of the stops the user wants to hide (depending on bus route)
	$.each(filterForm, function (i, item) {
		if ($(this).next().hasClass('ui-checkbox-on')) {
			busFilter(this.id);
			amount++;
		}
	});
	// If the user has not selected any ensure all are shown
	if (amount == 0) { 	
		$.each($('#map_canvas').gmap('get', 'markers'), function (i, item) {
			item.setVisible(true);
		}); 
	}
	$('.ui-dialog').dialog('close');
};
// Hide the Bus routes that do not have the users selection
function busFilter(busRoute) {
	$.each($('#map_canvas').gmap('get', 'markers'), function (i, item) {
        if (i != 0) {
			if ($.inArray(busRoute, item.routes) == -1) {
            	item.setVisible(false);
            } else {
				item.setVisible(true);
			}
        }
	});
};
// Show all of the bus routes
function showAllStops() {
	$.each($('#map_canvas').gmap('get', 'markers'), function (i, item) {
			item.setVisible(true);
	});
	var filterForm = $('fieldset#routes div input');
	$.each(filterForm, function (i, item) {
		// Get Check Boxes
		var checkBox = $(this).next()
		checkBox.addClass('ui-checkbox-off');
		checkBox.removeClass('ui-checkbox-on');
		// Get the Span's of Check Boxes
		var spanCheckBox = checkBox.children().children().next();
		spanCheckBox.removeClass('ui-icon-checkbox-on');
		spanCheckBox.addClass('ui-icon-checkbox-off');
	});
	$('.ui-dialog').dialog('close');
};
function checkFav(sid) {
	// Check if user's device is compatible with HTML5 Local Storage
	if (typeof(Storage)!=='undefined') {
		// Check if user has any favourites already
		if (localStorage.getItem('busStops')) {
			var favStops = localStorage.getItem('busStops');
			var jsonFavStops = JSON.parse(favStops);
			var check = 0;
			// Check if current stop is a favourite
			$.each(jsonFavStops, function(i, item) {
				if(item.id == sid) { check++; }
			});
			if (check != 0) { 
				$('div#addFavs').hide(); 
				$('div#fav').show();
			} else { 
				$('div#addFavs').show(); 
				$('div#fav').hide();
			}
		} else { 
			$('div#fav').hide();
			$('div#addFavs').show();
		};
	} else {
		$('div#fav').hide();
		$('div#addFavs').hide();
	}
};
function stopCountdown(sid) {
	$.get("/bus/show?sid=" + sid, function (data) {
		$('div#countdown').html(data).trigger('updatelayout');
	});
};
function staticMap(sid) {
	var jsonFavStops = JSON.parse(localStorage.getItem('busStops'));
	$.each(jsonFavStops, function (i, item) {
		if (item.id == sid) {
			$('img#map').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + item.geo + '&zoom=15&size=200x200&sensor=false&maptype=roadmap&markers=color:red%7C' + item.geo);
		}
	});
};	
function findMe() {
	navigator.geolocation.getCurrentPosition(function(position) {
		var geoLat = position.coords.latitude;
		var geoLng = position.coords.longitude;
		$('input#geoLng').val(geoLng);
		$('input#geoLat').val(geoLat);
	});
}


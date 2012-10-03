function geo() {
	navigator.geolocation.getCurrentPosition(function(position) {
		var geoAcc = position.coords.accuracy;
		$(function() {
			var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$('#map_canvas').gmap({
				'center': LatLng, 
				'zoom': 15, 
				'disableDefaultUI': true,
				'callback':function() {
					this.addMarker({'position': LatLng, 'bounds': false}).click(function(){
						alert("hi");
					});
				}
			});
			
		});
	});
}
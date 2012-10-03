(function() {
  var geo;

  geo = function() {
    return navigator.geolocation.getCurrentPosition(function(position) {
      var geoAcc;
      geoAcc = position.coords.accuracy;
      return $(function() {
        var LatLng;
        LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        return $("#map_canvas").gmap({
          center: LatLng,
          zoom: 15,
          disableDefaultUI: true,
          callback: function() {
            return this.addMarker({
              position: LatLng,
              bounds: false
            }).click(function() {
              return alert("hi");
            });
          }
        });
      });
    });
  };

  geo();

}).call(this);

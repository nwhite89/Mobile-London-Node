geo = ->
  navigator.geolocation.getCurrentPosition (position) ->
    geoAcc = position.coords.accuracy
    $ ->
      LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      $("#map_canvas").gmap
        center: LatLng
        zoom: 15
        disableDefaultUI: true
        callback: ->
          @addMarker(
            position: LatLng
            bounds: false
          ).click ->
            alert "hi"
geo()

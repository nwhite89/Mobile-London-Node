var	http = require('http')	
	, XmlStream = require('xml-stream')
	, $ = require('jquery')
	, dF = require('dateformat')
	;
	
exports.index = function(req, res) {
	// Check if user has selected a favourite journey
	if (req.query['to'] != undefined && req.query['toType'] != undefined && req.query['from'] != undefined && req.query['fromType'] != undefined) {
		userFav =	new Array({
						'from':	req.query['from']
						,	'fType':	req.query['fromType'].toLowerCase()
						,	'to':	req.query['to']
						,	'tType':	req.query['toType'].toLowerCase()
					});
	} else {
		var userFav = 'false';
	}
	// Get current date and time and display Form page
	var cTime = dF('H:MM')
		, cDate = dF('dd-mm-yyyy');
	res.render('planner/form', {
		title: 'Plan a Journey'
		,	time:	cTime
		,	date:	cDate
		,	userF: userFav
	});
};

// Check if the time is less than 10 and apply a leading zero
function timeCheck(time) {
	if (time < 10) {
		return  "0" + time;
	} else {
		return time;
	}
};
exports.redir = function(req, res) {
	res.redirect('/planner');
};
exports.journey = function(req, res) {
	// Recieve users journey details
	var time = req.body.time
		,	date = req.body.date.split('-')
		,	sDate = date[2] + date[1] + date[0]
		,	sFullDate = dF(date[1] + "-" + date[0] + "-" + date[2], "fullDate")
		,	originLoc = req.body.fromChoice
		,	destLoc = req.body.toChoice
		,	arrDep = req.body.ArriveDepart
		,	departArrive = ''
		,	origin = req.body.from.replace(/ /gi,'%20')
		,	dest = req.body.to.replace(/ /gi,'%20')
		;
	// Create transport array possibilites
	transportArray = new Array(
		'Train'
		,	'Commuter railway'
		,	'Underground'
		,	'City rail'
		,	'Tram'
		,	'Bus'
		,	'Regional bus'
		,	'Coach'
		,	'Cable car'
		,	'Boat'
		,	'Transit on demand '
		,	'Other'
		,	'Footpath'
	);
	// Check if the user has selected search by Arrive or Departure
	if (arrDep == 'arr') { departArrive = 'Arrive:' }
	else {	departArrive = 'Depart:' }
	// Test for journey detials by geo
	if (originLoc == 'coord') {
		var origin = req.body.geo + ':WGS84[DD.DDDDD]';
	} else if (destLoc == 'coord') {
		var dest = req.body.geo + ':WGS84[DD.DDDDD]';
	}
	// If favourite journey check if by co-ordinates and apply
	if (req.body.fav == 'true') {
		if (originLoc == 'coord') {
			var origin = req.body.from + ':WGS84[DD.DDDDD]';
		} else if (destLoc == 'coord') {
			var dest = req.body.to + ':WGS84[DD.DDDDD]';
		}
	}
	var	journeyPlanner = {
		host: 'jpapi.tfl.gov.uk',
		path: '/api/XML_TRIP_REQUEST2?language=en&sessionID=0&place_origin=London&type_origin=' + originLoc + '&name_origin=' + origin + '&place_destination=London&type_destination=' + destLoc + '&name_destination=' + dest + '&itdDate=' + sDate + '&itdTime=' + time + '&itdTripDateTimeDepArr=' + arrDep + '&exclMOT_7&excel_MOT_8&excel_MOT_9&excel_MOT_10&excel_MOT_11',
		method: 'GET',
		port: 80 
	}
	// Recieve TFL Tube Status XML
	http.get(journeyPlanner).on('response', function(response) {
		var xml = new XmlStream(response, 'utf8');
		var i=0, x=0;
		routeSummary = new Array();
		routeJourney = new Array();
		// Collect information from XML that is needed
		xml.collect('itdDateTime');
		xml.collect('itdPartialRoute');
		xml.collect('itdPartialRoute itdPoint');
		xml.collect('itdPartialRouteList itdPartialRoute itdPoint itdDateTime itdTime');
		routeDepature = new Array();
		xml.on('updateElement: itdRoute', function(item) {
			// Test to ensure depature and arrival times have been passed
			var depHr = item.itdPartialRouteList.itdPartialRoute[0].itdPoint[0].itdDateTime[0].itdTime[0].$.hour;
			var depMin = timeCheck(item.itdPartialRouteList.itdPartialRoute[0].itdPoint[0].itdDateTime[0].itdTime[0].$.minute);
			routeDepature[i] = depHr + ":" + depMin;
			i++;
			routeSummary.push({"Route": i, "Changes": item.$.changes, "Duration": item.$.publicDuration, "Page": "journey" + i});
		});
		var x = 0;
		routeArrival = new Array();
		xml.on('updateElement: itdPartialRouteList itdPartialRoute', function (data) {
			x++;
			var MoT = data.itdMeansOfTransport.$
				,	type = MoT.motType || 12
				,	take
			;
			// Check the type of transport and return the correct information
			if (type == 0) {
				take = "Take " + MoT.trainName + " towards " + MoT.destination;
			} else if (type == 2) {
				take = "Take " + MoT.name + " towards " + MoT.destination;
			} else if (type == 4) {
				take = "Take tram towards " + MoT.destination;
			} else if (type == 5) {
				take = "Take Bus route " + MoT.shortname + " towards " + MoT.destination;
			}
			// Set information about the journey
			if (routeJourney[i] == undefined) {
				var rDepTimeHr = data.itdPoint[0].itdDateTime[0].itdTime[0].$.hour
					,	rDepTimeMin = timeCheck(data.itdPoint[0].itdDateTime[0].itdTime[0].$.minute)
					,	rArrTimeHr = data.itdPoint[1].itdDateTime[0].itdTime[0].$.hour
					,	rArrTimeMin = timeCheck(data.itdPoint[1].itdDateTime[0].itdTime[0].$.minute)
					,	rTime = rDepTimeHr + ":" + rDepTimeMin + " to " + rArrTimeHr + ":" + rArrTimeMin
					;
				info = new Array({"Depart": data.itdPoint[0].$.name, "Arrival": data.itdPoint[1].$.name, "Type": transportArray[type], "Time": rTime, "Take": take});
				routeJourney[i] = info;
			} else {
				var rDepTimeHr = data.itdPoint[0].itdDateTime[0].itdTime[0].$.hour
					,	rDepTimeMin = timeCheck(data.itdPoint[0].itdDateTime[0].itdTime[0].$.minute)
					,	rArrTimeHr = data.itdPoint[1].itdDateTime[0].itdTime[0].$.hour
					,	rArrTimeMin = timeCheck(data.itdPoint[1].itdDateTime[0].itdTime[0].$.minute)
					,	rTime = rDepTimeHr + ":" + rDepTimeMin + " to " + rArrTimeHr + ":" + rArrTimeMin
					;
				info = ({"Depart": data.itdPoint[0].$.name, "Arrival": data.itdPoint[1].$.name, "Type": transportArray[type], "Time": rTime, "Take": take});
				routeJourney[i].push(info);
			}
			// Create Arrival information for route
			var arrHr = data.itdPoint[1].itdDateTime[0].itdTime[0].$.hour
			var arrMin = timeCheck(data.itdPoint[1].itdDateTime[0].itdTime[0].$.minute);
			routeArrival[i] = arrHr + ":" + arrMin;
		});
		// At the end of the XML read display Journeys and information gathered
		xml.on('end', function () {
			if (i == 0) { 
				res.render('planner/error', {
					title:	'Journey Error'
					,	dateTime: " " + sFullDate + " at " + req.body.time
					,	from:	" " + req.body.from
					,	to:	" " + req.body.to
					,	depArr:	departArrive
				});
			} else {
				var relFrom = req.body.from || req.body.geo;
				var relTo = req.body.to || req.body.geo;
				res.render('planner/journey', {
				   title:	'Journey'
				   ,	routeInfo: routeSummary
				   ,	routeArr: routeArrival
				   ,	routeDep: routeDepature
				   ,	journeyInfo: routeJourney
				   ,	depArr:	departArrive
				   ,	dateTime: " " + sFullDate + " at " + req.body.time
				   ,	from:	" " + req.body.from
				   ,	to:	" " + req.body.to
				   ,	favRel:	relFrom + "?" + relTo + "?" + originLoc + "?" + destLoc
				});
			}
		});
	});
};
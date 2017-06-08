var inputRoadName = document.getElementById('update-road');
var btnSubmit = document.getElementById('send-updates');
var inputDesc = document.getElementById('description');
var optSituation = document.getElementById('situation');
var divTweetList = document.getElementById('local-tweet-container');


/*var geocoder;*/

var inputAutoComplete;

// write updates data to firebase
function writeNewData(name, details, situation, latlng) {
	var obj = {
		name: name,
		details: details,
		situation: situation,
		position: latlng,
		timestamp: +new Date()
	};

	var newKey = firebase.database().ref().child('updates').push().key;
	var updates = {};

	updates['/updates/' + newKey] = obj;

	return firebase.database().ref().update(updates);
}


// initialize the map
function initMap() {
	inputAutoComplete = new google.maps.places.Autocomplete(inputRoadName, { componentRestrictions: { country: 'KE' } });

	var map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -1.2920659, lng: 36.82194619999996 },
		zoom: 10,
		mapTypeControl: false
	});


	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var roadAutocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: 'KE' } });
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.

	roadAutocomplete.addListener('place_changed', function () {
		var places = roadAutocomplete.getPlace();
		console.log(places.geometry.location);
		map.setCenter(places.geometry.location);
		map.setZoom(17);
	});

	// Add Updates marker on the map from firebase
	firebase.database().ref('updates').on('child_added', snapshot => {
		var infowindow = new google.maps.InfoWindow();
		var childData = snapshot.val();
		var date = +new Date();

		if ((childData.timestamp + 3600000) >= date) {

			var html = '<div id="marker-updates">' +
				'<h6>' + childData.name + '</h6>' +
				'<p>' + childData.situation + '</p>' +
				'<p>' + childData.details + '</p>' +
				'</div>';

			var iconBase = window.location.href.toString().split(window.location.pathname)[0];
			var icon = {
				clear: {
					icon: iconBase + "/images/yellow.png"
				},
				medium: {
					icon: iconBase + "/images/blue.png"
				},
				heavy: {
					icon: iconBase + "/images/red.png"
				}
			};

			var marker = new google.maps.Marker({
				map: map,
				position: childData.position,
				icon: icon[childData.situation].icon
			});

			marker.addListener('click', function () {
				infowindow.setContent(html);
				infowindow.open(map, marker);
			});
		}
	});

	// add tweets marker on the map from firebase
	firebase.database().ref('tweets').on('child_added', snapshot => {
		var infowindow = new google.maps.InfoWindow();
		var childData = snapshot.val();
		var date = +new Date();
		var x = JSON.parse(childData.time);

		if ((x + 3600000) >= date) {
			var posi = {
				lat: childData.lat,
				lng: childData.lon
			};


			var html = '<div id="marker-updates">' +
				'<h6>' + childData.timestamp + '</h6>' +
				'<p>' + childData.sentiment + '</p>' +
				'<p>' + childData.text + '</p>' +
				'</div>';

			var iconBase = window.location.href.toString().split(window.location.pathname)[0];
			var icon = {
				positive: {
					icon: iconBase + "/images/yellow.png"
				},
				neutral: {
					icon: iconBase + "/images/blue.png"
				},
				negative: {
					icon: iconBase + "/images/red.png"
				}
			};


			var marker = new google.maps.Marker({
				map: map,
				position: posi,
				icon: icon[childData.sentiment].icon
			});
			marker.addListener('click', function () {
				infowindow.setContent(html);
				infowindow.open(map, marker);
			});
		}
	});

	// Tweets on Traffic Feed tab from less than an hour
	firebase.database().ref('tweets').orderByChild('time').on('child_added', function (snap) {
		var childData = snap.val();
		var currDate = +new Date();
		var x = JSON.parse(childData.time);

		if ((x + 3600000) >= currDate) {
			var date = new Date(x);
			var prettyTimestamp = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
				date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
			var time = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " Hrs";
			if (childData.name == 'Uhuru') {
				var html = '<div id="feed">' +
					'<div >' +
					'<div><b>' + childData.name + " Highway" + '</b><span class="right" style="margin-left: 0%">&nbsp; Time: ' + time + '</span></div>' +
					'<div>' + childData.text + '</div>' +
					'</div>' +
					'</div>';
				divTweetList.insertAdjacentHTML('beforebegin', html);
			}
			else if (childData.name == 'University') {
				var html = '<div id="feed">' +
					'<div >' +
					'<div><b>' + childData.name + " Way" + '</b><span class="right">&nbsp; Time: ' + time + '</span></div>' +
					'<div>' + childData.text + '</div>' +
					'</div>' +
					'</div>';
				divTweetList.insertAdjacentHTML('beforebegin', html);
			}
			else if (childData.name == 'Waiyaki') {
				var html = '<div id="feed">' +
					'<div >' +
					'<div><b>' + childData.name + " Way" + '</b><span class="right">&nbsp; Time: ' + time + '</span></div>' +
					'<div>' + childData.text + '</div>' +
					'</div>' +
					'</div>';
				divTweetList.insertAdjacentHTML('beforebegin', html);
			}
			else {
				var html = '<div id="feed">' +
					'<div >' +
					'<div><b>' + childData.name + " Road" + '</b><span class="right">&nbsp; Time: ' + time + '</span></div>' +
					'<div>' + childData.text + '</div>' +
					'</div>' +
					'</div>';
				divTweetList.insertAdjacentHTML('beforebegin', html);
			}
		}
	});

	// Updates on the traffic feed tab from less than an hour
	firebase.database().ref('updates').orderByChild('timestamp').on('child_added', function (snap) {
		var childData = snap.val();
		var currDate = +new Date();

		if ((childData.timestamp + 3600000) >= currDate) {
			var date = new Date(childData.timestamp);
			var prettyTimestamp = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
				date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
			var time = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + " Hrs";
			var html = '<div id="feed">' +
				'<div >' +
				'<div><b>' + childData.name + '</b><span class="right">&nbsp; Time: ' + time + '</span></div>' +
				'<div>' + childData.details + '</div>' +
				'</div>' +
				'</div>';

			divTweetList.insertAdjacentHTML('beforebegin', html);
		}
	});

	btnSubmit.addEventListener('click', e => {
		var name = inputRoadName.value;
		var details = inputDesc.value;
		var sit = optSituation.value;
		var timestamp = new Date();

		var position = {
			lat: inputAutoComplete.getPlace().geometry.location.lat(),
			lng: inputAutoComplete.getPlace().geometry.location.lng(),
		};


		writeNewData(name, details, sit, position, timestamp);

		inputRoadName.value = "";
		inputDesc.value = "";

		setTimeout(function () {
			location.reload()
		}, 2000);
	});

}//end initMap

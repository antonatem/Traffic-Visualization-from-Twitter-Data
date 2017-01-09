var inputRoadName = document.getElementById('update-road');
var btnSubmit = document.getElementById('send-updates');
var inputDesc = document.getElementById('description');
var optSituation = document.getElementById('situation');
var divTweetList = document.getElementById('local-tweet-container');


var divNeutral = document.getElementById('neutral-div');
var divPositive = document.getElementById('positive-div');
var divNegative = document.getElementById('negative-div');

var geocoder;

var inputAutoComplete;


function writeNewData(name, details, situation, latlng) {
    var obj = {
        name: name,
        details: details,
        situation: situation,
        position: latlng
    };

    var newKey = firebase.database().ref().child('updates').push().key;
    var updates = {};

    updates['/updates/' + newKey] = obj;

    return firebase.database().ref().update(updates);
}



function initMap(){
	inputAutoComplete = new google.maps.places.Autocomplete(inputRoadName, {componentRestrictions:{country: 'KE'}});
	
	var map = new google.maps.Map(document.getElementById('map'),{
		center: {lat:-1.2920659, lng: 36.82194619999996},
		zoom:10,
		mapTypeControl: false
	});

	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);

	// Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var roadAutocomplete = new google.maps.places.Autocomplete(input, {componentRestrictions: {country: 'KE'}});
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.



    roadAutocomplete.addListener('place_changed', function() {
      var places = roadAutocomplete.getPlace();
      	console.log(places.geometry.location);
      	map.setCenter(places.geometry.location);
      	map.setZoom(17);    
    });
                              

	firebase.database().ref('updates').on('value', snapshot =>{
    	var infowindow = new google.maps.InfoWindow();

    	snapshot.forEach(childSnapshot => {
	        var childData = childSnapshot.val();
	        console.log(childData.details);

	        var html = '<div id="marker-updates">'+
	        '<h6>'+ childData.name +'</h6>'+
	        '<p>'+ childData.situation + '</p>'+
	        '<p>'+ childData.details + '</p>'+
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

	        marker.addListener('click', function(){
	            infowindow.setContent(html);
	            infowindow.open(map, marker);
	        });
    });
});

firebase.database().ref('tweets').on('value', snapshot =>{
    var infowindow = new google.maps.InfoWindow();

    snapshot.forEach(childSnapshot => {
        var childData = childSnapshot.val();
        var posi = {
            lat: childData.lat,
            lng: childData.lon
        };

        
        var html = '<div id="marker-updates">'+
        '<h6>'+ childData.timestamp +'</h6>'+
        '<p>'+ childData.sentiment + '</p>'+
        '<p>'+ childData.text + '</p>'+
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
        marker.addListener('click', function(){
            infowindow.setContent(html);
            infowindow.open(map, marker);
        })
    });
});

firebase.database().ref('tweets').orderByChild('timestamp').limitToFirst(5).on('value', function(snap){
		var newName;
		geocoder = new google.maps.Geocoder();

        snap.forEach(childSnap =>{
           var childData = childSnap.val();
           var tweetPos = {
           		lat: childData.lat,
           		lng: childData.lon
           };

           geocoder.geocode({'location': tweetPos}, function(results, status){
           		if (status === 'OK') {
           			if (results[0]) {
           				newName = results[0].formatted_address;
           				console.log(newName);
           				var html = 
		                '<div id="alert-'+ childSnap.key +'" style="border: solid 1px">'+
		                '<div >' +
		                '<div><b>'+ newName  +'</b><span class="right">&nbsp; Time: '+ childData.timestamp +'</span></div>'+
		                '<div>'+ childData.text +'</div>'+
		                '</div>'+
		                '</div>'; 

		              divTweetList.insertAdjacentHTML('beforeend', html);
           			}else{
           				newName = 'N/A';
           			}
           		}else {
           			console.log(status);
           		}
           });
                 
            });  
});

firebase.database().ref('tweets').on('value', snapshot =>{
	var el = document.createElement('ul');
	divNeutral.appendChild(el);

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();
		var tweetPos = {
           		lat: childData.lat,
           		lng: childData.lon
           };

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'neutral'){

			geocoder.geocode({'location': tweetPos}, function(results, status){
           		if (status === 'OK') {
           			if (results[0]) {
           				newName = results[0].formatted_address;
           				console.log(newName);
						var html = '<li style="border: solid 1px">'+ newName + '</li>';
						el.insertAdjacentHTML('beforeend', html);
           			}else{
           				newName = 'N/A';
           			}
           		}else {
           			console.log(status);
           		}
           });
			
		}
	});

});


firebase.database().ref('tweets').on('value', snapshot =>{
	var el = document.createElement('ul');
	divPositive.appendChild(el);

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();
		var tweetPos = {
           		lat: childData.lat,
           		lng: childData.lon
           };

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'positive'){
			geocoder.geocode({'location': tweetPos}, function(results, status){
           		if (status === 'OK') {
           			if (results[0]) {
           				newName = results[0].formatted_address;
           				console.log(newName);
						var html = '<li style="border: solid 1px">'+ newName + '</li>';
						el.insertAdjacentHTML('beforeend', html);
           			}else{
           				newName = 'N/A';
           			}
           		}else {
           			console.log(status);
           		}
           });
		}
	});

});


firebase.database().ref('tweets').on('value', snapshot =>{
	var el = document.createElement('ul');
	divNegative.appendChild(el);

	console.log(snapshot.val());

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();
		var tweetPos = {
           		lat: childData.lat,
           		lng: childData.lon
           };

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'negative'){
			geocoder.geocode({'location': tweetPos}, function(results, status){
           		if (status === 'OK') {
           			if (results[0]) {
           				newName = results[0].formatted_address;
           				console.log(newName);
						var html = '<li style="border: solid 1px">'+ newName + '</li>';
						el.insertAdjacentHTML('beforeend', html);
           			}else{
           				newName = 'N/A';
           			}
           		}else {
           			console.log(status);
           		}
           });
		}
	});

});


btnSubmit.addEventListener('click', e => {
    var name = inputRoadName.value;
    var details = inputDesc.value;
    var sit = optSituation.value;

    writeNewData(name, details, sit, position);

    inputRoadName.value = "";
    inputDesc.value = "";

}); 

}//end initMap




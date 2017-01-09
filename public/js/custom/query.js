var divNeutral = document.getElementById('neutral-div');
var divPositive = document.getElementById('positive-div');
var divNegative = document.getElementById('negative-div');


firebase.database().ref('tweets').orderByChild().on('value', snapshot =>{
	var el = document.createElement('ul');
	divNeutral.appendChild('el');

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'neutral'){
			var html = '<li>'+ childData.road + '</li>';
			el.insertAdjacentHTML('beforeend', html);
		}
	});

});


firebase.database().ref('tweets').orderByChild().on('value', snapshot =>{
	var el = document.createElement('ul');
	divPositive.appendChild('el');

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'positive'){
			var html = '<li>'+ childData.road + '</li>';
			el.insertAdjacentHTML('beforeend', html);
		}
	});

});


firebase.database().ref('tweets').orderByChild().on('value', snapshot =>{
	var el = document.createElement('ul');
	divNegative.appendChild('el');

	snapshot.forEach(childSnap =>{
		var childData = childSnap.val();

		if(childData.timestamp >= Date.now() - 3600000 && childData.sentiment == 'negative'){
			var html = '<li>'+ childData.road + '</li>';
			el.insertAdjacentHTML('beforeend', html);
		}
	});

});
// Create sections to hold roads with heavy, light, medium traffic from less than an hour
var divNegative = document.getElementById('negative-div');
var count = 0;
var sum = 0;

var eln = document.createElement('ul');
divNegative.appendChild(eln);

let heavyTraffic = [];
let mediumTraffic = [];
let lightTraffic = [];

// positive updates from the past hour
firebase.database().ref('updates').orderByChild('situation').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	if (childData.situation == 'clear' && (childData.timestamp + 3600000) >= date) {
		lightTraffic.push(childData.name);
	}
});

// Neutral updates for the past hour
firebase.database().ref('updates').orderByChild('situation').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	if (childData.situation == 'medium' && (childData.timestamp + 3600000) >= date) {
		mediumTraffic.push(childData.name);
	}
});


// negative updates from the past one hour
firebase.database().ref('updates').orderByChild('situation').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	if (childData.situation == 'heavy' && (childData.timestamp + 3600000) >= date) {
		heavyTraffic.push(childData.name);
	}
});

// neutral tweets from the past hour
firebase.database().ref('tweets').orderByChild('sentiment').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	var x = JSON.parse(childData.time);

	if (childData.sentiment == 'neutral' && (x + 3600000) >= date) {
		mediumTraffic.push(childData.name);
	}
});

// positive tweets from the past hour
firebase.database().ref('tweets').orderByChild('sentiment').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	var x = JSON.parse(childData.time);

	if (childData.sentiment == 'positive' && (x + 3600000) >= date) {
		lightTraffic.push(childData.name);
	}
});


// negative tweets from the past hour
firebase.database().ref('tweets').orderByChild('sentiment').on('child_added', function (snap) {
	var childData = snap.val();
	var date = +new Date();
	var x = JSON.parse(childData.time);

	if (childData.sentiment == 'negative' && (x + 3600000) >= date) {
		heavyTraffic.push(childData.name);
	}
});

setTimeout(function () {
	let negTraffic = [...new Set(heavyTraffic)];
	let netTraffic = [...new Set(mediumTraffic)];
	let posTraffic = [...new Set(lightTraffic)];
	let trafficData = [negTraffic, netTraffic, posTraffic];

	for (let i = 0; i < negTraffic.length; i += 1) {
		if (negTraffic[i] == 'Uhuru') {
			var html = '<li>' + negTraffic[i] + ' highway' + '</li>';
			eln.insertAdjacentHTML('beforeend', html);
		}
		else if (negTraffic[i] == 'University') {
			var html = '<li>' + negTraffic[i] + ' way' + '</li>';
			eln.insertAdjacentHTML('beforeend', html);
		}
		else if (negTraffic[i] == 'Waiyaki') {
			var html = '<li>' + negTraffic[i] + ' way' + '</li>';
			eln.insertAdjacentHTML('beforeend', html);
		}
		else {
			var html = '<li>' + negTraffic[i] + ' road' + '</li>';
			eln.insertAdjacentHTML('beforeend', html);
		}
	}

	let totalTraffic = negTraffic.length + netTraffic.length + posTraffic.length;

	let chartProperties = {
		chart: {
			renderTo: 'pie-chart',
			plotBackgroundColor: 'transparent',
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: 'Nairobi Traffic levels for the last 1 Hr'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
			percentageDecimals: 0
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: 'Traffic',
			colorByPoint: true,
			data: [{
				name: 'Heavy Traffic',
				y: negTraffic.length / totalTraffic * 100,
				color: '#FF0000',
				sliced: true,
				selected: true
			}, {
				name: 'Medium Traffic',
				y: netTraffic.length / totalTraffic * 100,
				color: '#0000FF'
			}, {
				name: 'Light Traffic',
				y: posTraffic.length / totalTraffic * 100,
				color: '#FFFF00'
			}]
		}]
	}

	let chart = new Highcharts.Chart(chartProperties);
}, 5000);

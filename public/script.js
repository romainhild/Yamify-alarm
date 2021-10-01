'use strict;'

const daysFR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

///////////// make html for an alarm
function makeHeader(alarm) {
    let h1 = document.createElement("h1");
    h1.className = "accordion-header";
    h1.setAttribute("id", `header${alarm._id}`);
    let dflex = document.createElement("div");
    dflex.className = "d-flex";
    let button = document.createElement("button");
    button.className = "accordion-button collapsed";
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${alarm._id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${alarm._id}`);
    button.setAttribute("id", `textHeader${alarm._id}`);
    button.innerHTML = `${alarm.time}`;
    dflex.appendChild(button);
    let divSwitch = document.createElement("div");
    divSwitch.className = "form-check form-switch d-flex align-items-start position-fixed";
    divSwitch.setAttribute("style", "right:50px; z-index:1000;");
    let switch1 = document.createElement("input");
    switch1.className = "form-check-input";
    switch1.setAttribute("type", "checkbox");
    switch1.setAttribute("id", `switch${alarm._id}`);
    if( alarm.state )
	switch1.setAttribute('checked', '');
    switch1.onchange = function() {
	stateChanged(alarm._id, switch1.checked);
    };
    divSwitch.appendChild(switch1);
    dflex.appendChild(divSwitch);
    h1.appendChild(dflex);
    return h1;
}

function makeTime(id, time) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `time${id}`);
    label.className = "col-sm-3 col-form-label";
    label.innerHTML = "Heure";
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let timeIn = document.createElement('input');
    timeIn.setAttribute("type", "time");
    timeIn.setAttribute("id", `time${id}`);
    timeIn.setAttribute("name", `time${id}`);
    timeIn.setAttribute("required", '');
    timeIn.setAttribute("value", time);
    timeIn.onchange = function() {
	timeChanged(id, timeIn.value, time);
    };
    divIn.appendChild(timeIn);
    div.appendChild(divIn);
    return div;
}

function makeRepetition(id, repetition) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.className = "col-sm-3 col-form-label";
    label.innerHTML = "Repetition";
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let divGr = document.createElement('div');
    divGr.className = "btn-group";
    divGr.setAttribute('role', 'group');
    divGr.setAttribute("aria-label","Basic example");
    for (day in repetition) {
	let input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("class", "btn-check");
	input.setAttribute("autocomplete", "off");
	input.setAttribute("id", `check${day}${id}`);
	input.setAttribute("value", day);
	if( repetition[day] )
	    input.setAttribute("checked", "");
	input.onchange = function() {
	    repetChanged(id, input.value, input.checked);
	};
	divGr.appendChild(input);
	let label = document.createElement("label");
	label.setAttribute("class", "btn btn-primary");
	label.setAttribute("for", `check${day}${id}`);
	label.innerHTML = `${day.charAt(0)}`;
	divGr.appendChild(label);
    }
    divIn.appendChild(divGr);
    div.appendChild(divIn);
    return div;
}

function makeVolume(id, volume) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `volume${id}`);
    label.className = "col-sm-3 col-form-label";
    label.setAttribute("id", `volumeLabel${id}`);
    label.innerHTML = `Volume ${volume}%`;
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let volumeIn = document.createElement('input');
    volumeIn.setAttribute("type", "range");
    volumeIn.setAttribute("class", "form-range");
    volumeIn.setAttribute("min", "0");
    volumeIn.setAttribute("max", "100");
    volumeIn.setAttribute("step", "1");
    volumeIn.setAttribute("id", `volume${id}`);
    volumeIn.setAttribute("value", volume);
    volumeIn.onchange = function() {
	volumeChanged(id, volumeIn.value, volume);
    };
    divIn.appendChild(volumeIn);
    div.appendChild(divIn);
    return div;
}

function makePlaylist(id, playlist) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `playlist${id}`);
    label.className = "col-sm-3 col-form-label";
    label.innerHTML = `Playlist`;
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let playlistIn = document.createElement('select');
    playlistIn.className = "form-select";
    playlistIn.setAttribute("aria-label", "Select Playlist");
    playlistIn.setAttribute("id", `playlist${id}`);
    let option = document.createElement("option");
    option.setAttribute("value", playlist);
    option.setAttribute("selected", "");
    option.innerHTML = playlist;
    playlistIn.appendChild(option);
    divIn.appendChild(playlistIn);
    div.appendChild(divIn);
    return div;
}

function makeDelete(id) {
    let div = document.createElement('div');
    div.className = "row mb-3 justify-content-center";
    let button = document.createElement('button');
    button.setAttribute("type", "button");
    button.className = "btn btn-danger col-sm-3";
    button.innerHTML = "Supprimer";
    button.onclick = function() {
	alarmDelete(id);
    };
    div.appendChild(button);
    return div;
}

function makeCollapse(alarm) {
    let div = document.createElement('div');
    div.className = "accordion-collapse collapse";
    div.setAttribute("id", `collapse${alarm._id}`);
    div.setAttribute("aria-labelledby",`heading${alarm._id}`);
    div.setAttribute("data-bs-parent", "#accordionAlarm");
    let bodyDiv = document.createElement('div');
    bodyDiv.className = "accordion-body";
    let form = document.createElement('form');
    let time = makeTime(alarm._id, alarm.time);
    form.appendChild(time);
    let repet = makeRepetition(alarm._id, alarm.repetition);
    form.appendChild(repet);
    let volume = makeVolume(alarm._id, alarm.volume);
    form.appendChild(volume);
    let playlist = makePlaylist(alarm._id, alarm.playlist);
    form.appendChild(playlist);
    let del = makeDelete(alarm._id);
    form.appendChild(del);
    bodyDiv.appendChild(form);
    div.appendChild(bodyDiv);
    return div;
}

function makeAlarm(alarm) {
    let accordion = document.getElementById("accordionAlarm");
    var alarmItem = document.createElement('div');
    alarmItem.className = "accordion-item";
    alarmItem.setAttribute("id", `item${alarm._id}`);
    let header = makeHeader(alarm);
    let collapse = makeCollapse(alarm);
    alarmItem.appendChild(header);
    alarmItem.appendChild(collapse);
    accordion.appendChild(alarmItem);
}

//////////////// handle changes to the alarms
function stateChanged(id, state) {
    axios.patch(`alarms/${id}`, {state: `${state}`})
	.then(function(response) {
	    alarms.get(id).state = state;
	})
	.catch(function(error) {
	    console.log(error);
	    console.log(alarms);
	    console.log(id);
	    document.getElementById(`switch${id}`).checked = alarms.get(id).state;
	});
}

function timeChanged(id, time) {
    if( id ) {
	axios.patch(`alarms/${id}`, {time: `${time}`})
	    .then(function(response) {
		alarms.get(id).time = time;
		document.getElementById(`textHeader${id}`).innerHTML = time;
	    })
	    .catch(function(error) {
		console.log(error);
		document.getElementById(`time${id}`).value = alarms.get(id).time;
	    });	
    }
    else {
	let t = document.getElementById("time");
	let p = document.getElementById("playlist");
	if( t.value && p.value ) {
	    document.getElementById("saveNewAlarmButton").disabled = false;
	}
	else {
	    document.getElementById("saveNewAlarmButton").disabled = true;
	}
    }
}

function repetChanged(id, day, state) {
    if( id ) {
	let newRepetition = Object.assign({}, alarms.get(id).repetition);
	newRepetition[day] = state;
	axios.patch(`alarms/${id}`, {repetition: newRepetition})
	    .then(function(response) {
		alarms.get(id).repetition = newRepetition;
	    })
	    .catch(function(error) {
		console.log(error);
		document.getElementById(`check${day}${id}`).checked = !state;
	    });
    }
}

function volumeChanged(id, volume) {
    if( id ) {
	axios.patch(`alarms/${id}`, {volume: volume})
	    .then(function(response) {
		alarms.get(id).volume = volume;
		document.getElementById(`volumeLabel${id}`).innerHTML = `Volume ${volume}%`;
	    })
	    .catch(function(error) {
		console.log(error);
		document.getElementById(`volume${id}`).value = alarms.get(id).volume;
	    });
    }
};

function alarmDelete(id) {
    axios.delete(`alarms/${id}`)
	.then(function(response) {
	    alarms.delete(id);
	    document.getElementById(`item${id}`).remove();
	})
	.catch(function(error) {
	    console.log(error);
	});
}

///////////////// add an alarm
function addAlarm() {
    console.log("add alarm");
    let form = document.createElement('form');
    let time = makeTime('', '');
    form.appendChild(time);
    let repet = makeRepetition('', {"Lundi":false,"Mardi":false,"Mercredi":false,"Jeudi":false,"Vendredi":false,"Samedi":false,"Dimanche":false});
    form.appendChild(repet);
    let volume = makeVolume('', 50);
    form.appendChild(volume);
    let playlist = makePlaylist('', 'test'); // to change !!!
    form.appendChild(playlist);
    document.getElementById('newAlarmBody').appendChild(form);
    var myModal = new bootstrap.Modal(document.getElementById('newAlarmModal'));
    myModal.show();
}

function saveAlarm() {
    let time = document.getElementById("time").value;
    let repetition = {};
    for( let day of daysFR )
	repetition[day] = document.getElementById(`check${day}`).checked;
    let volume = document.getElementById("volume").value;
    let playlist = document.getElementById("playlist").value;
    axios.post('alarms',
	       { time: time,
		 repetition: repetition,
		 volume: volume,
		 playlist: playlist,
		 state: true })
	.then(function(response) {
	    alarms.set(response.data._id, response.data);
	    makeAlarm(response.data);
	    var myModalEl = document.getElementById('newAlarmModal');
	    var myModal = bootstrap.Modal.getInstance(myModalEl);
	    myModal.hide();
	})
	.catch(function(error) {
	    console.log(error);
	});;
}

document.getElementById("addButton").onclick = addAlarm;
document.getElementById("saveNewAlarmButton").onclick = saveAlarm;

var settingsModal = document.getElementById('settingsModal')
settingsModal.addEventListener('show.bs.modal', function (event) {
    console.log('open settings');
});

axios.defaults.withCredentials = true;
var alarms = new Map([]);
axios.get("alarms")
    .then(function (response) {
	for ( let alarm of response.data )
	    alarms.set(alarm._id, alarm);
	alarms.forEach(makeAlarm);
    })
    .catch(function (error) {
	console.log(error);
    });

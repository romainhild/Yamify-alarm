function makeHeader(id, time, state) {
    let h1 = document.createElement("h1");
    h1.className = "accordion-header";
    h1.setAttribute("id", `header${id}`);
    let dflex = document.createElement("div");
    dflex.className = "d-flex";
    let button = document.createElement("button");
    button.className = "accordion-button collapsed";
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${id}`);
    button.setAttribute("id", `textHeader${id}`);
    button.innerHTML = `${time}`;
    dflex.appendChild(button);
    let divSwitch = document.createElement("div");
    divSwitch.className = "form-check form-switch d-flex align-items-start position-fixed";
    divSwitch.setAttribute("style", "right:50px; z-index:1000;");
    let switch1 = document.createElement("input");
    switch1.className = "form-check-input";
    switch1.setAttribute("type", "checkbox");
    switch1.setAttribute("id", `switch${id}`);
    if( state )
	switch1.setAttribute('checked', '');
    switch1.onchange = function() {
	stateChanged(id, switch1.checked);
    };
    divSwitch.appendChild(switch1);
    dflex.appendChild(divSwitch);
    h1.appendChild(dflex);
    return h1;
}

function makeTime(alarm) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `time${alarm._id}`);
    label.className = "col-sm-3 col-form-label";
    label.innerHTML = "Heure";
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let time = document.createElement('input');
    time.setAttribute("type", "time");
    time.setAttribute("id", `time${alarm._id}`);
    time.setAttribute("name", `time${alarm._id}`);
    time.setAttribute("required", '');
    time.setAttribute("value", alarm.time);
    time.onchange = function() {
	timeChanged(alarm._id, time.value, alarm.time);
    };
    divIn.appendChild(time);
    div.appendChild(divIn);
    return div;
}

function makeRepetition(alarm) {
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
    for (day in alarm.repetition) {
	let input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("class", "btn-check");
	input.setAttribute("autocomplete", "off");
	input.setAttribute("id", `check${day}${alarm._id}`);
	input.setAttribute("value", day);
	if( alarm.repetition[day] )
	    input.setAttribute("checked", "");
	input.onchange = function() {
	    repetChanged(alarm._id, input.value, input.checked);
	};
	divGr.appendChild(input);
	let label = document.createElement("label");
	label.setAttribute("class", "btn btn-primary");
	label.setAttribute("for", `check${day}${alarm._id}`);
	label.innerHTML = `${day.charAt(0)}`;
	divGr.appendChild(label);
    }
    divIn.appendChild(divGr);
    div.appendChild(divIn);
    return div;
}

function makeVolume(alarm) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `volume${alarm._id}`);
    label.className = "col-sm-3 col-form-label";
    label.setAttribute("id", `volumeLabel${alarm._id}`);
    label.innerHTML = `Volume ${alarm.volume}%`;
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let volume = document.createElement('input');
    volume.setAttribute("type", "range");
    volume.setAttribute("class", "form-range");
    volume.setAttribute("min", "0");
    volume.setAttribute("max", "100");
    volume.setAttribute("step", "1");
    volume.setAttribute("id", `volume${alarm._id}`);
    volume.setAttribute("value", alarm.volume);
    volume.onchange = function() {
	volumeChanged(alarm._id, volume.value, alarm.volume);
    };
    divIn.appendChild(volume);
    div.appendChild(divIn);
    return div;
}

function makePlaylist(alarm) {
    let div = document.createElement('div');
    div.className = "row mb-3";
    let label = document.createElement('label');
    label.setAttribute("for", `playlist${alarm._id}`);
    label.className = "col-sm-3 col-form-label";
    label.innerHTML = `Playlist`;
    div.appendChild(label);
    let divIn = document.createElement('div');
    divIn.className = "col-sm-9";
    let playlist = document.createElement('select');
    playlist.className = "form-select";
    playlist.setAttribute("aria-label", "Select Playlist");
    let option = document.createElement("option");
    option.setAttribute("value", alarm.playlist);
    option.setAttribute("selected", "");
    option.innerHTML = alarm.playlist;
    playlist.appendChild(option);
    divIn.appendChild(playlist);
    div.appendChild(divIn);
    return div;
}

function makeDelete(alarm) {
    let div = document.createElement('div');
    div.className = "row mb-3 justify-content-center";
    let button = document.createElement('button');
    button.setAttribute("type", "button");
    button.className = "btn btn-danger col-sm-3";
    button.innerHTML = "Supprimer";
    button.onclick = function() {
	alarmDelete(alarm._id);
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
    let time = makeTime(alarm);
    form.appendChild(time);
    let repet = makeRepetition(alarm);
    form.appendChild(repet);
    let volume = makeVolume(alarm);
    form.appendChild(volume);
    let playlist = makePlaylist(alarm);
    form.appendChild(playlist);
    let del = makeDelete(alarm);
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
    let header = makeHeader(alarm._id, alarm.time, alarm.state);
    let collapse = makeCollapse(alarm);
    alarmItem.appendChild(header);
    alarmItem.appendChild(collapse);
    accordion.appendChild(alarmItem);
}

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

function repetChanged(id, day, state) {
    let newRepetition = Object.assign({}, alarms.get(id).repetition);
    newRepetition[day] = state;
    console.log(alarms.get(id).repetition);
    console.log(newRepetition);
    axios.patch(`alarms/${id}`, {repetition: newRepetition})
	.then(function(response) {
	    alarms.get(id).repetition = newRepetition;
	})
	.catch(function(error) {
	    console.log(error);
	    document.getElementById(`check${day}${id}`).checked = !state;
	});
    console.log(`alarm ${id} changed repetition for ${day} to ${state}`);
}

function volumeChanged(id, volume) {
    axios.patch(`alarms/${id}`, {volume: volume})
	.then(function(response) {
	    alarms.get(id).volume = volume;
	    document.getElementById(`volumeLabel${id}`).innerHTML = `Volume ${volume}%`;
	})
	.catch(function(error) {
	    console.log(error);
	    document.getElementById(`volume${id}`).value = alarms.get(id).volume;
	});
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


var alarms = new Map([]);
axios.get("alarms")
    .then(function (response) {
	for ( let alarm of response.data )
	    alarms.set(alarm._id, alarm);
	alarms.forEach(makeAlarm);
    })
    .catch(function (error) {
	// handle error
	console.log(error);
    });

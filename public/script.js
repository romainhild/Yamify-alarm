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
    time.setAttribute("value", alarm.time); // hh:mm
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
	if( alarm.repetition[day] )
	    input.setAttribute("checked", "");
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
    label.innerHTML = `Volume ${alarm.volume}`;
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
    console.log(alarm);
    let accordion = document.getElementById("accordionAlarm");
    var alarmItem = document.createElement('div');
    alarmItem.className = "accordion-item";
    let header = makeHeader(alarm._id, alarm.time, alarm.state);
    let collapse = makeCollapse(alarm);
    alarmItem.appendChild(header);
    alarmItem.appendChild(collapse);
    accordion.appendChild(alarmItem);
}

axios.get("https://test.hild.ovh/alarms")
    .then(function (response) {
	for ( alarm in response.data )
	    makeAlarm(response.data[alarm]);
    })
    .catch(function (error) {
	// handle error
	console.log(error);
    });

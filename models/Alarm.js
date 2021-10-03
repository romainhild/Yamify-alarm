const mongoose = require('mongoose');
const schedule = require('node-schedule');
const setAlarm = require('../alarm');

var alarmMap = new Map();

function job(a) {
    let times = a.time.split(':');
    let h = times[0];
    let m = times[1];
    let doRepet = [...a.repetition.values()].reduce((p,c) => {return (p || c)}, false);
    if( doRepet ) {
        let d = [...[...a.repetition.values()].entries()].reduce((p,c) => {return c[1] ? (p ? (p+','+c[0]+1) : c[0]+1) : p}, "");
        let job = schedule.scheduleJob(`${m} ${h} * * ${d}`, function(){
            console.log(`Alarm running all ${m} ${h} * * ${d}`);
            setAlarm(a.username, a.playlist_uri, a.volume);
        });
        return job;
    } else {
        var d = new Date();
        if( d.getHours() > h || (d.getHours() == h && d.getMinutes() >= m) )
            d.setDate(d.getDate()+1);
        d.setHours(h, m, 0);
        console.log(d.toString());
        let job = schedule.scheduleJob(d, function() {
            console.log(`Alarm running on ${d.toString()}`);
            setAlarm(a.username, a.playlist_uri, a.volume);
        });
        return job;
    }
}

const alarm = mongoose.Schema({
    time: {type: String, required: true},
    repetition: {type: Map, of: Boolean, required: true},
    volume: {type: Number, required: true},
    playlist_id: {type: String, required: true},
    playlist_name: {type: String, required: true},
    playlist_uri: {type: String, required: true},
    state: {type: Boolean, required: true},
    username: {type: String, required: true}
});

alarm.post('save', function(a) {
    if( alarmMap.has(a._id) )
        alarmMap.get(a._id).cancel();
    if(a.state)
        alarmMap.set(a._id, job(a));
    console.log(`save alarm ${a._id}`);
});
alarm.post('deleteOne', function(a) {
    alarmMap.get(a._id).cancel();
    alarmMap.delete(a._id);
    console.log(`remove alarm ${a._id}`);
    console.log(`alarmMap size: ${alarmMap.size}`);
});

let Alarm = mongoose.model("Alarm", alarm);
module.exports = Alarm;

async function setupAlarmsJob() {
    const alarms = await Alarm.find({state: true});
    alarms.forEach((a) => {
        alarmMap.set(a._id, job(a));
    });
}

setupAlarmsJob();

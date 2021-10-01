'use strict';

const router = require('express').Router();
const Alarm = require('../models/Alarm');
const {verify} = require('../auth');

router.use(verify);
router
    .get('/', async (req, res) => {
        const alarms = await Alarm.find({username: res.locals.username});
        res.send(alarms);
    })
    .post('/', async (req, res) => {
        try{
            const alarm = new Alarm({
                time: req.body.time,
                repetition: req.body.repetition,
                volume: req.body.volume,
                playlist: req.body.playlist,
                state: req.body.state,
                username: res.locals.username
            });
            await alarm.save();
            res.send(alarm);
        }
        catch(e){
            return res.status(400).send(e.message);
        }
    })
    .get('/:id', async (req, res) => {
        try {
            const alarm = await Alarm.findOne({ _id: req.params.id, username: res.locals.username });
            res.send(alarm);
        } catch {
            res.status(404).send({ error: "Alarm doesn't exist!" });
        }
    })
    .delete('/:id', async (req, res) => {
        try {
            await Alarm.deleteOne({ _id: req.params.id, username: res.locals.username });
            res.sendStatus(204);
        } catch {
            res.status(204).send({error: "Alarm doesn't exist!" });
        }
    })
    .patch('/:id', async (req, res) => {
        try {
            const alarm = await Alarm.findOne({ _id: req.params.id, username: res.locals.username });
            if( req.body.time )
                alarm.time = req.body.time;
            if( req.body.repetition )
                alarm.repetition = req.body.repetition;
            if( req.body.volume )
                alarm.volume = req.body.volume;
            if( req.body.playlist )
                alarm.playlist = req.body.playlist;
            if( req.body.state )
                alarm.state = req.body.state;

            await alarm.save();
            res.send(alarm);
        } catch {
            res.status(404).send({ error: "Alarm doesn't exist!" });
        }
    });

module.exports = router;

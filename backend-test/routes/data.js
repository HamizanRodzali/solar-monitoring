const express = require('express');
const Data = require('../model/data.model');
const router = express.Router();

router.get('/graph/:deviceId', async function (req, res) {
    var macAddress = req.params.deviceId;

    let today = new Date();
    today.setHours(0, 0, 0, 0)
    let first = today.getDate() - today.getDay();
    let last = first + 6;
    let firstday = new Date(today.setDate(first)).toUTCString();
    let lastday = new Date(today.setDate(last)).toUTCString();
    let firstDayMonth = new Date(today.setDate(1));
    let lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    lastDayMonth.setHours(23, 59, 59, 0);
    today = new Date().setHours(0, 0, 0, 0);

    let d = await Promise.all([
        Data.find({
            macAddress: macAddress,
            createdAt: {
                $gte: today
            }
        }).exec(),
        Data.find({
            macAddress: macAddress,
            createdAt: {
                $gte: firstday,
                $lte: lastday
            }
        }).exec(),
        Data.find({
            macAddress: macAddress,
            createdAt: {
                $gte: firstDayMonth,
                $lte: lastDayMonth
            }
        }).exec()
    ]);
    res.json(d);
});

router.get('/:deviceId/:limit', function (req, res) {
    var macAddress = req.params.deviceId;
    var limit = parseInt(req.params.limit) || 30;
    Data
        .find({
            macAddress: macAddress
        })
        .sort({ 'createdAt': -1 })
        .limit(limit)
        .exec(function (err, devices) {
            if (err) return res.status(500).send(err);
            res.status(200).json(devices);
        });
});

router.post('/', function (req, res) {
    var data = req.body;
    // data.createdBy = req.user._id;
    Data.create(data, function (err, _data) {
        if (err) return res.status(500).send(err);
        res.json(_data);
    });
});

module.exports = router;
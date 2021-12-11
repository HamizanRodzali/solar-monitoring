const express = require('express');
const Device = require('../model/device.model');
const router = express.Router();

router.get('/', function (req, res) {
    Device.find({}, function (err, devices) {
        if (err) return res.status(500).send(err);
        res.status(200).json(devices);
    });
});

router.delete('/:id', function (req, res) {
    Device.findOne({
        _id: req.params.id
    }, function(err, device) {
        if (err) return res.status(500).send(err);

        device.remove(function(err) {
            if (err) return res.status(500).send(err);
            return res.status(204).end();
        });
    });
    // console.log(req.params.id)
})

router.post('/', function (req, res) {
    var device = req.body;
    // this device is created by the current user
    // device.createdBy = req.user._id;
    Device.create(device, function (err, device) {
        if (err) return res.status(500).send(err);
        res.json(device);
    });
});
module.exports = router;
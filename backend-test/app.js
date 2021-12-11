const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();

// app.use(cors());
// app.options('*', cors());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8100");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('connected');
    setInterval(() => {
        socket.emit('temp', {
            tempLM35: rand(30, 90),
            lightSensor: rand(1, 10),
            solarV: rand(30, 90),
            solarmA: rand(1, 5),
            temp: rand(10, 50),
            humd: rand(30, 90)
        })
    }, 2000)
});

app.get('/v1', (req, res) => {
    res.json('api v1');
})
app.post('/device', require('./routes/device'));
app.get('/device', require('./routes/device'))

server.listen(3000, () => {
    console.log('server started on port 3000');
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


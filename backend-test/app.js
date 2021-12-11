const http = require('http');
const express = require('express');
const logger = require('morgan');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors =  require('cors');
// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', {
    options: {
        db: {
            safe: true
        }
    }
});
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

const app = express();
app.use(cors())
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
    
}); 

app.use('/device', require('./routes/device'));

server.listen(3000, () => {
    console.log('server started on port 3000');
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


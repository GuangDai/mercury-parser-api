const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cluster = require('cluster')


const config = require('./config');
const routes = require('./routes');


const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(morgan('tiny'));

app.use('/', routes);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)

    // ...... worker ......
    for (let i = 0; i < process.env.FORK_NUMBER; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {

    app.listen(config.server.port, () => {
        console.log(`🚀Mercury Parser API listens on port ${config.server.port}`);
    });
}
module.exports = app;

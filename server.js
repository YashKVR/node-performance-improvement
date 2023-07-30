const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

function delay(duration) {
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        //event loop is blocked...
    }
}

app.get('/', (req, res) => {
    res.send(`Performance Example ${process.pid}`)
});

app.get('/timer', (req, res) => {
    //delay the response
    delay(9000);
    res.send(`Ding Ding Ding! ${process.pid}`);
})

if (cluster.isMaster) {
    console.log('Master has been started');
    const NUM_WORKERS = os.cpus().length;
    console.log(`I have ${NUM_WORKERS} logical cores in my CPU`);
    for (let i = 0; i < NUM_WORKERS; i++) {
        cluster.fork();
    }
} else {
    console.log('Worker Process started');
    app.listen(3000);
}
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register a listener
emitter.on('messageLogged', (arg) => {
    console.log('ListenerCalled', arg);
})

const log = require('./logger');
log('message');
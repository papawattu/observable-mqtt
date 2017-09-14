import EventEmitter from 'events'

const mqtt = {}
const client = new EventEmitter()

client.publish = (topic, message) => client.emit('message', topic, message )
client.subscribe = topic => undefined
client.unsubscribe = topic => undefined
stub_mqtt.connect = () => client

client.on('message', (topic, message) => {
    if (process.env.DEBUG === 'true')
        console.log(`topic ${topic} - message = ${message.toString('hex')}`)
})

export default mqtt
import { Observable } from 'rxjs'
import _mqtt from 'mqtt'

const ObservableMqtt = ({ mqtt = _mqtt, uri, options = {} }) => topic => {
    const client = mqtt.connect(uri, options)
    client.subscribe(topic)
    const messages = Observable.fromEvent(client, 'message', (topic, message) => ({ topic, message }))
        .filter(msg => msg.topic === topic)
        .map(msg => msg.message)
    return {
        send: message => client.publish(topic, message),
        messages: () => messages,
        destroy: () => client.end()
    }
}


export default ObservableMqtt
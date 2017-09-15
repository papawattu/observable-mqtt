import { Observable } from 'rxjs'

const ObservableMqtt = ({ mqtt, uri, options = {} }) => topic => {
    const client = mqtt.connect(uri, options)
    client.subscribe(topic)
    return {
        send: message => client.publish(topic, message),
        messages: () => Observable.fromEvent(client, 'message', (topic, message) => ({ topic, message }))
            .filter(msg => msg.topic === topic)
            .map(msg => msg.message)
            .share()
    }
}

export default ObservableMqtt
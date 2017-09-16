import chai from 'chai';
import sinon from 'sinon';
import ObservableMqtt from './observable-mqtt';
import mqtt from './test/mqtt-stub'
import { client } from './test/mqtt-stub'

const assert = chai.assert;

describe('Observable mqtt wrapper', () => {

    it('Should bootstrap', () => {
        const sut = ObservableMqtt({ mqtt })
        assert.isNotNull(sut)
    })
    it('Should have return a function', () => {
        const sut = ObservableMqtt({ mqtt })
        assert.isFunction(sut)
    })
    it('Should call connect with passed arguments', () => {

        const spy = sinon.spy(mqtt, 'connect')
        const sut = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('topic')

        assert(spy.calledWith('mqtt://fakeuri'), 'mqtt connect method should be called once with args mqtt://fakeuri')
    })
    it('Should call send with "my message"', () => {

        const spy = sinon.spy(client, 'publish')
        const { send } = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('topic')

        send('my message')

        assert(spy.calledWith('topic', 'my message'), 'mqtt send method should be called once with args faketopic and my message')
    })
    it('Should receive "my message" from topic mytopic', done => {

        const { send, messages } = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('mytopic')

        messages()
            .subscribe(msg => {
                assert(msg === 'my message')
                done()
            })

        client.emit('message', 'mytopic', 'my message')

    })
    it('Should send message to topic myothertopic2', done => {

        const { send } = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('myothertopic2')

        client.once('message', (topic, message) => {
            assert.equal('myothertopic2', topic)
            done()
        })

        send('my message 3')

    })
    it('Should send "my message 4" and receive message', done => {

        const { send } = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('myothertopic3')

        client.once('message', (topic, message) => {
            assert.equal(message, 'my message 4')
            done()
        })

        send('my message 4')

    })
    it('Should close connection on destroy', () => {

        const { destroy } = ObservableMqtt({ mqtt, uri: 'mqtt://fakeuri' })('myothertopic3')
        const spy = sinon.spy(client, 'end')
        destroy()

        assert(spy.calledOnce, 'client end should be called on destroy')
    })
})
import chai from 'chai';
import sinon from 'sinon';
import ObservableMqtt from './observable-mqtt';
import mqtt from '.test/mqtt-stub'

const assert = chai.assert;

describe('observable mqtt wrapper', () => {
    
    it('Should bootstrap', () => {
        
       const sut = ObservableMqtt({ mqtt })


    })
})
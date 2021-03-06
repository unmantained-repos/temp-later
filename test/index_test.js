'use strict';

import tempLater from '../index';
import concat from 'concat-stream';
import {Readable} from 'stream';

describe('tempLater', () => {

    it('is defined', () => {
        tempLater.should.be.a('function');
    });

    it('support sync values', (done) => {
        const john = 'jude';
        const data = new Date().getFullYear();
        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });

    it('support promise', (done) => {
        const john = 'jude';
        const data = new Promise(resolve => {
            setTimeout( () => {
                resolve(new Date().getFullYear().toString());
            });
        });
        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });

     it('support non-string promise', (done) => {
        const john = 'jude';
        const data = new Promise(resolve => {
            setTimeout( () => {
                resolve(new Date().getFullYear());
            });
        });
        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });


    it('support multiple promises', (done) => {
        const john = new Promise( resolve => {
            setTimeout( () => {
                resolve('jude');
            });
        });
        const data = new Promise( resolve => {
            setTimeout( () => {
                resolve(new Date().getFullYear().toString());
            });
        });
        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });


    it('support streams', (done) => {
        const john = new Readable();
        const jude = 'jude'.split('');

        john._read = () => {
            if (jude.length) {
                setTimeout( () => {
                    let value = jude.shift();
                    john.push(value);
                    if (jude.length === 0) {
                        john.push(null);
                    }
                }, 10);
            }

        };

        const data = new Date().getFullYear();

        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });

    it('support non-string streams', (done) => {
        const john = 'jude';

        const data = new Readable({ objectMode: true });
        const year = [2, 0, 1, 5];

        data._read = () => {
            if (year.length) {
                setTimeout( () => {
                    let value = year.shift();
                    data.push(value);
                    if (year.length === 0) {
                        data.push(null);
                    }
                }, 10);
            }

        };

        const result = tempLater`ciao ${john} come butta ${data}`;

        result.pipe(concat({encoding: 'string'}, dt => {
            dt.should.be.equal('ciao jude come butta 2015');
            done();
        }));

    });

});

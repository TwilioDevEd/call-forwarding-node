const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiXml = require('chai-xml');
const xml2js = require('xml2js');
const server = require('../app');
const models  = require('../models');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiXml);


describe('CallForwarding', function() {
  it('should render index on / GET', (done) => {
    chai.request(server)
      .get('/')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res).to.be.html;
          done();
        }
      );
  });

  it('should get TwiML to gather state no on /callcongress/welcome POST', (done) => {
    chai.request(server)
      .post('/callcongress/welcome')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Gather[0].$.action',
              '/callcongress/state-lookup'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML to gather state validation on /callcongress/welcome POST', (done) => {
    chai.request(server)
      .post('/callcongress/welcome')
      .type('form')
      .send({FromState: 'IL'})
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Gather[0].$.action',
              '/callcongress/set-state'
            );
            expect(result).to.have.deep.property(
              'Response.Gather[0].$.fromState',
              'IL'
            );
          });
          done();
        }
      );
  });

  it('should be redirected to senator call when confirming state on /callcongress/set-state POST', (done) => {
    chai.request(server)
      .post('/callcongress/set-state')
      .type('form')
      .send({Digits: 1, CallerState: 'IL'})
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Dial[0]._',
              '+14157671351'
            );
          });
          done();
        }
      );
  });

  it('should be redirected set state when invalidating state on /callcongress/set-state POST', (done) => {
    chai.request(server)
      .post('/callcongress/set-state')
      .type('form')
      .send({Digits: 2})
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Gather[0].$.numDigits',
              '5'
            );
            expect(result).to.have.deep.property(
              'Response.Gather[0].$.action',
              '/callcongress/state-lookup'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for dialing senator when sending state no on /callcongress/state-lookup POST', (done) => {
    chai.request(server)
      .post('/callcongress/state-lookup')
      .type('form')
      .send({Digits: '60616'})
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Say[0]',
              'Connecting you to Richard J. Durbin. After the senator\'s office ends the call, you will be re-directed to Tammy Duckworth.'
            );
            expect(result).to.have.deep.property(
              'Response.Dial[0].$.action',
              '/callcongress/call-second-senator/26'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for dialing senator on /callcongress/call-senators/id POST', (done) => {
    chai.request(server)
      .post('/callcongress/call-senators/13')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Dial[0]._',
              '+14157671351'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for redirecting to second senator on /callcongress/call-senators/id POST', (done) => {
    chai.request(server)
      .post('/callcongress/call-senators/13')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Dial[0].$.action',
              '/callcongress/call-second-senator/26'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for dialing second senator on /callcongress/call-second-senator/id POST', (done) => {
    chai.request(server)
      .post('/callcongress/call-second-senator/26')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Dial[0]._',
              '+12174412652'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for redirecting to goodbye on /callcongress/call-second-senator/id POST', (done) => {
    chai.request(server)
      .post('/callcongress/call-second-senator/26')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Dial[0].$.action',
              '/callcongress/goodbye/'
            );
          });
          done();
        }
      );
  });

  it('should get TwiML for saying to goodbye on /callcongress/goodbye POST', (done) => {
    chai.request(server)
      .post('/callcongress/goodbye')
      .end(
        (err, res) => {
          res.should.have.status(200);
          expect(res.text).xml.to.be.valid;
          new xml2js.Parser().parseString(res.text, (err, result) => {
            expect(result).to.have.deep.property(
              'Response.Say[0]',
              'Thank you for using Call Congress! Your voice makes a difference. Goodbye.'
            );
          });
          done();
        }
      );
  });
});
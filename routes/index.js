const models  = require('../models');
const express = require('express');
const router  = express.Router();
const twilio = require('twilio');

// Very basic route to landing page.
router.get('/', function (req, res) {
  res.render('index');
});


// Verify or collect State information.
router.post('/callcongress/welcome', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  const fromState = req.body.FromState;

  if (fromState) {
    response.gather({
      numDigits: 1,
      action: '/callcongress/set-state',
      method: 'POST',
      fromState: fromState
    }, (node) => {
      node.say("Thank you for calling congress! It looks like " +
               "you're calling from " + fromState + "." +
               "If this is correct, please press 1. Press 2 if " +
               "this is not your current state of residence.");
    });
  } else {
    response.gather({
      numDigits: 5,
      action: '/callcongress/state-lookup',
      method: 'POST'
    }, (node) => {
      node.say('Thank you for calling Call Congress! If you wish to' +
               'call your senators, please enter your 5-digit zip code.');
    });
  }
  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});


// Look up state from given zipcode.
//
// Once state is found, redirect to call_senators for forwarding.
router.post('/callcongress/state-lookup', (req, res) => {
  zipDigits = req.body.Digits;
  // NB: We don't do any error handling for a missing/erroneous zip code
  // in this sample application. You, gentle reader, should to handle that
  // edge case before deploying this code.
  models.ZipCode.findOne({where: { zipcode: zipDigits}}).get('state').then(
    (state) => {
      return models.State.findOne({where: {name: state}}).get('id').then(
        (stateId) => {
          return res.redirect('/callcongress/call-senators/' + stateId);
        }
      );
    }
  );
});


// If our state guess is wrong, prompt user for zip code.
router.get('/callcongress/collect-zip', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.gather({
      numDigits: 5,
      action: '/callcongress/state-lookup',
      method: 'POST'
    }, (node) => {
      node.say('If you wish to call your senators, please ' +
               'enter your 5-digit zip code.');
    }
  );
  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});


// Set state for senator call list.
//
// Set user's state from confirmation or user-provided Zip.
// Redirect to call_senators route.
router.post('/callcongress/set-state', (req, res) => {
  // Get the digit pressed by the user
  const digitsProvided = req.body.Digits;

  if (digitsProvided === '1') {
    const state = req.body.CallerState;
    models.State.findOne({where: {name: state}}).get('id').then(
      (stateId) => {
        return res.redirect('/callcongress/call-senators/' + stateId);
      }
    );
  } else {
    res.redirect('/callcongress/collect-zip')
  }
});


function callSenator(req, res) {
  models.State.findOne({
    where: {
      id: req.params.state_id
    }
  }).then(
    (state) => {
      return state.getSenators().then(
        (senators) => {
          const response = new twilio.twiml.VoiceResponse();
          response.say("Connecting you to " + senators[0].name + ". " +
           "After the senator's office ends the call, you will " +
           "be re-directed to " + senators[1].name + ".");
          response.dial(senators[0].phone, {
            action: '/callcongress/call-second-senator/' + senators[1].id
          });
          res.set('Content-Type', 'text/xml');
          return res.send(response.toString());
        }
      );
    }
  );
}

// Route for connecting caller to both of their senators.
router.get('/callcongress/call-senators/:state_id', callSenator);
router.post('/callcongress/call-senators/:state_id', callSenator);


function callSecondSenator(req, res) {
  models.Senator.findOne({
    where: {
      id: req.params.senator_id
    }
  }).then(
    (senator) => {
      const response = new twilio.twiml.VoiceResponse();
      response.say("Connecting you to " + senator.name + ". ");
      response.dial(senator.phone, {
        action: '/callcongress/goodbye/'
      });
      res.set('Content-Type', 'text/xml');
      return res.send(response.toString());
    }
  );
}

// Forward the caller to their second senator.
router.get('/callcongress/call-second-senator/:senator_id',  callSecondSenator);
router.post('/callcongress/call-second-senator/:senator_id',  callSecondSenator);


// Thank user & hang up.
router.post('/callcongress/goodbye', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.say("Thank you for using Call Congress! " +
               "Your voice makes a difference. Goodbye.");
  response.hangup();
  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
});

module.exports = router;
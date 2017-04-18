'use strict';

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');
const Promise = require("bluebird");

const models = require("../models");

function parseJSON(filepath) {
  const jsonfilepath = filepath || path.join(__dirname, '../senators.json');
  const content = fs.readFileSync(jsonfilepath);
  return JSON.parse(content);
}

function statesFromJSON(filepath) {
  const json = parseJSON(filepath);
  return json.states;
}

function senatorsFromJSON(filepath) {
  const json = parseJSON(filepath);
  const senators = json.states.reduce(
    (acc, state) => {
      if (Array.isArray(json[state])) {
        acc.push(
          models.State.findOne({ where: {name: state} })
                      .get('id')
                      .then(
                        (id) => { 
                          return json[state].map(
                            (senator) => { 
                              senator.StateId = id;
                              delete senator['state'];
                              return senator;
                            }
                          );
                        }
                      )
        );
      }
      return acc;
    },
    []
  );

  return Promise.reduce(
    senators,
    (acc, value) => {
      return acc.concat(value);
    },
    []
  );
}

function parseCSV(filepath) {
  return new Promise(function (resolve, reject) {
    var parser = csv({delimiter: ',', escape: '"', from: 2},
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
        parser.end();
      });
    fs.createReadStream(filepath).pipe(parser);
  });
}

function zipsFromCSV(filepath) {
  const csvfilepath = filepath || path.join(__dirname, '../free-zipcode-database.csv');
  return parseCSV(csvfilepath).then(
    (data) => {
      return new Promise((resolve) => {
        resolve(data.map((row) => { 
          return {zipcode: row[0], state: row[3] }
        }));
      });
    },
    (reason) => { 
      console.log('Error while parsing CSV: ' + reason);
    }
  );
}

module.exports = {
  zipsFromCSV: zipsFromCSV,
  statesFromJSON: statesFromJSON,
  senatorsFromJSON: senatorsFromJSON
}
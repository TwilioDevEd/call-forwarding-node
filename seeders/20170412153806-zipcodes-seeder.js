'use strict';
const parsers = require('../utils/parsers');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return parsers.zipsFromCSV().then(
      (zipcodes) => { 
        return queryInterface.bulkInsert('ZipCodes', zipcodes, {});
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ZipCodes', null, {});
  }
};
